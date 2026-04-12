const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');
const http = require('http');
const { spawn } = require('child_process');
const { randomUUID, createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 8000;

// Cobalt API is running on http://cobalt:8000 inside Docker network
const COBALT_URL = process.env.COBALT_URL || 'http://cobalt:8000';

// Initialize database on startup
db.initializeDb().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'VideoSnap Proxy is running' });
});

// ── Derive public base URL from request headers ───────────────────────────
function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers['host'];
  return `${proto}://${host}`;
}

// ── Analytics helpers ───────────────────────────────────────────────────────
// Extract real client IP (handle X-Forwarded-For, X-Real-IP from proxies)
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    '127.0.0.1'
  );
}

// Get or create session ID (stored in cookie)
function getSessionId(req) {
  if (!req.sessionId) {
    req.sessionId = randomUUID();
  }
  return req.sessionId;
}

// ── Video Cache System (30-min TTL) ──────────────────────────────────────────
const CACHE_DIR = '/tmp/videosnap-cache';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// In-memory cache metadata (key → { filePath, expiresAt })
const cacheMetadata = new Map();

// Hash a URL to create a cache key
function getCacheKey(url, quality = '') {
  return createHash('sha256').update(`${url}:${quality}`).digest('hex');
}

// Check if cache entry exists and is not expired
function getCachedFile(url, quality) {
  const key = getCacheKey(url, quality);
  const entry = cacheMetadata.get(key);
  
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    // Expired — delete it
    try {
      fs.unlinkSync(entry.filePath);
    } catch (e) {}
    cacheMetadata.delete(key);
    return null;
  }
  
  // Valid cache entry
  if (fs.existsSync(entry.filePath)) {
    console.log(`[Cache] Hit for ${url}`);
    return entry.filePath;
  }
  
  // File was deleted but metadata exists — clean up
  cacheMetadata.delete(key);
  return null;
}

// Store a file in cache
function setCacheFile(filePath, url, quality) {
  const key = getCacheKey(url, quality);
  cacheMetadata.set(key, {
    filePath,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  console.log(`[Cache] Stored ${url} → ${filePath}`);
}

// Periodic cache cleanup (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  let deleted = 0;
  for (const [key, entry] of cacheMetadata) {
    if (entry.expiresAt < now) {
      try {
        fs.unlinkSync(entry.filePath);
        deleted++;
      } catch (e) {}
      cacheMetadata.delete(key);
    }
  }
  if (deleted > 0) console.log(`[Cache] Cleaned up ${deleted} expired entries`);
}, 5 * 60 * 1000).unref();

// Download URL to a file
function downloadToFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    client.get(url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

// Serve a file with Range support
function serveFile(filePath, req, res, logContext) {
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const rangeHeader = req.headers['range'];

  let start = 0;
  let end = fileSize - 1;
  let statusCode = 200;

  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
    start = match[1] ? parseInt(match[1]) : 0;
    end = match[2] ? parseInt(match[2]) : fileSize - 1;
    statusCode = 206;
  }

  const chunkSize = end - start + 1;
  const fileStream = fs.createReadStream(filePath, { start, end });

  res.writeHead(statusCode, {
    'Content-Type': 'video/mp4',
    'Content-Length': chunkSize,
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Origin': '*',
  });

  fileStream.pipe(res);

  // Log download analytics if context provided
  if (logContext && statusCode === 200 && start === 0) {
    const clientIp = getClientIp(req);
    const sessionId = getSessionId(req);
    db.logDownload(
      logContext.platform,
      logContext.urlHash,
      logContext.quality || '1080',
      clientIp,
      fileSize,
      req.headers['user-agent'] || 'unknown',
      sessionId
    );
  }
}

// ── Cobalt stream proxy (Instagram) ─────────────────────────────────────────
// Check cache first, then fetch from Cobalt and pipe to browser with Range support.
app.get('/api/stream/instagram', async (req, res) => {
  const urlParam = req.query.url;
  if (!urlParam) return res.status(400).json({ detail: 'Missing url parameter' });

  // Check cache first
  const cachedFile = getCachedFile(urlParam, '1080');
  const urlHash = getCacheKey(urlParam, '1080');
  if (cachedFile) {
    return serveFile(cachedFile, req, res, { platform: 'instagram', urlHash, quality: '1080' });
  }

  try {
    const decodedUrl = decodeURIComponent(urlParam);
    const cobaltResponse = await axios.post(`${COBALT_URL}/`, {
      url: decodedUrl,
      downloadMode: 'auto',
      filenameStyle: 'basic',
      videoQuality: '1080',
    }, { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } });

    const data = cobaltResponse.data;
    if (data.status === 'error') {
      return res.status(400).json({ detail: `Download error: ${data.error?.code || 'Unknown'}` });
    }

    let mediaUrl = null;
    if (data.status === 'tunnel' || data.status === 'redirect') mediaUrl = data.url;
    else if (data.status === 'picker' && data.picker?.length > 0) mediaUrl = data.picker[0].url;
    if (!mediaUrl) return res.status(400).json({ detail: 'No media URL from service' });

    // Download to cache file
    const cacheFile = path.join(CACHE_DIR, `ig-${urlHash}.mp4`);
    await downloadToFile(mediaUrl, cacheFile);
    setCacheFile(cacheFile, decodedUrl, '1080');

    serveFile(cacheFile, req, res, { platform: 'instagram', urlHash, quality: '1080' });
  } catch (error) {
    console.error('[Instagram stream] Error:', error.message);
    if (!res.headersSent) res.status(500).json({ detail: error.message });
  }
});

// ── yt-dlp stream (YouTube) ──────────────────────────────────────────────────
// yt-dlp downloads to a temp file first (ffmpeg needs seek for MP4 mux),
// then we stream the file to the browser with full Range support.
app.get('/api/stream/youtube', async (req, res) => {
  const urlParam = req.query.url;
  const quality = req.query.quality || '1080';
  if (!urlParam) return res.status(400).json({ detail: 'Missing url parameter' });

  // Check cache first
  const cachedFile = getCachedFile(urlParam, quality);
  const urlHash = getCacheKey(urlParam, quality);
  if (cachedFile) {
    return serveFile(cachedFile, req, res, { platform: 'youtube', urlHash, quality });
  }

  const ext = quality === 'audio' ? 'm4a' : 'mp4';
  const cacheFile = path.join(CACHE_DIR, `yt-${urlHash}.${ext}`);

  let format;
  if (quality === 'audio') {
    format = 'bestaudio[ext=m4a]/bestaudio';
  } else {
    format = [
      `bestvideo[vcodec^=avc][height<=${quality}]+bestaudio[ext=m4a]`,
      `bestvideo[vcodec^=avc][height<=${quality}]+bestaudio`,
      `bestvideo[height<=${quality}][ext=mp4]+bestaudio[ext=m4a]`,
      `best[height<=${quality}][ext=mp4]`,
      `best[height<=${quality}]`,
      'best',
    ].join('/');
  }

  const ytdlpArgs = [
    '--no-playlist',
    '--concurrent-fragments', '5',
    '-f', format,
    '--merge-output-format', ext,
    '-o', cacheFile,
    decodeURIComponent(urlParam),
  ];

  console.log(`[yt-dlp] Downloading quality=${quality} → ${cacheFile}`);

  const ytdlp = spawn('yt-dlp', ytdlpArgs);

  ytdlp.stderr.on('data', (data) => {
    const line = data.toString().trim();
    if (line) console.log('[yt-dlp]', line);
  });

  ytdlp.on('error', (err) => {
    console.error('[yt-dlp] spawn error:', err.message);
    fs.unlink(cacheFile, () => {});
    if (!res.headersSent) res.status(500).json({ detail: 'yt-dlp not available' });
  });

  ytdlp.on('close', (code) => {
    if (code !== 0) {
      console.error(`[yt-dlp] exited with code ${code}`);
      fs.unlink(cacheFile, () => {});
      if (!res.headersSent) return res.status(500).json({ detail: 'yt-dlp download failed' });
      return;
    }

    // Downloaded successfully — cache it
    setCacheFile(cacheFile, decodeURIComponent(urlParam), quality);
    serveFile(cacheFile, req, res, { platform: 'youtube', urlHash, quality });
  });
});

// ── POST /api/instagram ──────────────────────────────────────────────────────
app.post('/api/instagram', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url?.trim()) return res.status(400).json({ detail: 'Please enter an Instagram URL' });
    if (!/instagram\.com/i.test(url)) return res.status(400).json({ detail: 'Please enter a valid Instagram URL (instagram.com)' });

    // Validate via Cobalt first to get the filename, then return stream URL
    const cobaltResponse = await axios.post(`${COBALT_URL}/`, {
      url: url.trim(), downloadMode: 'auto', filenameStyle: 'basic', videoQuality: '1080',
    }, { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } });

    const data = cobaltResponse.data;
    if (data.status === 'error') {
      return res.status(400).json({ detail: `Download error: ${data.error?.code || 'Unknown'}` });
    }
    if (!['tunnel','redirect','picker'].includes(data.status)) {
      return res.status(400).json({ detail: `Unexpected response: ${data.status}` });
    }

    const streamUrl = `${getBaseUrl(req)}/api/stream/instagram?url=${encodeURIComponent(url.trim())}`;
    return res.json({ videoUrl: streamUrl, title: data.filename || 'instagram_video.mp4' });
  } catch (error) {
    console.error('[Instagram] Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) return res.status(503).json({ detail: 'Cobalt service is not running' });
    return res.status(500).json({ detail: `Server error: ${error.message}` });
  }
});

// ── POST /api/youtube ────────────────────────────────────────────────────────
app.post('/api/youtube', (req, res) => {
  const { url, quality } = req.body;
  if (!url?.trim()) return res.status(400).json({ detail: 'Please enter a YouTube URL' });
  if (!/youtube\.com|youtu\.be/i.test(url)) return res.status(400).json({ detail: 'Please enter a valid YouTube URL (youtube.com or youtu.be)' });

  const q = quality || '1080';
  const ext = q === 'audio' ? 'm4a' : 'mp4';
  const streamUrl = `${getBaseUrl(req)}/api/stream/youtube?url=${encodeURIComponent(url.trim())}&quality=${q}`;

  // Return immediately — no separate yt-dlp title fetch.
  // The real filename comes from Content-Disposition on the stream endpoint.
  return res.json({ videoUrl: streamUrl, title: `youtube_video.${ext}` });
});

// ── POST /api/pageview ───────────────────────────────────────────────────────
// Log a page view (called by frontend when a page loads)
app.post('/api/pageview', async (req, res) => {
  const { page } = req.body;
  if (!page) return res.status(400).json({ detail: 'Missing page parameter' });

  const clientIp = getClientIp(req);
  const sessionId = getSessionId(req);

  db.logPageView(page, clientIp, req.headers['user-agent'] || 'unknown', sessionId);
  res.json({ success: true });
});

// ── GET /api/stats ───────────────────────────────────────────────────────────
// Get analytics stats (optionally with ?days=N parameter)
app.get('/api/stats', async (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 7, 365); // Cap at 1 year

  try {
    const stats = await db.getStats(days);
    res.json(stats || { error: 'Failed to retrieve stats' });
  } catch (error) {
    console.error('[Stats] Error:', error.message);
    res.status(500).json({ detail: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Cobalt (Instagram) at: ${COBALT_URL}`);
  console.log(`📺 YouTube via: yt-dlp`);
  console.log(`📊 Analytics: POST /api/pageview, GET /api/stats`);
});
