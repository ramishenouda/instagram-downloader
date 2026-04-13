import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchYoutubeVideo } from '../api/youtube';
import VideoResult from '../components/VideoResult';

const QUALITY_OPTIONS = [
  { value: '1080', label: '1080p (Full HD)' },
  { value: '720', label: '720p (HD)' },
  { value: '480', label: '480p (SD)' },
  { value: 'audio', label: 'Audio only (MP3)' },
];

export default function YoutubePage() {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('1080');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Log pageview on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'youtube' }),
    }).catch(console.error);
  }, []);

  const handleDownload = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchYoutubeVideo(url, quality);
      setResult(data);
      setUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app app--youtube">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-section logo-link">
            <img src="/logo.svg" alt="VideoSnap Logo" className="app-icon-img" />
            <div>
              <h1 className="app-title">VideoSnap</h1>
              <p className="app-subtitle">Download YouTube videos, shorts &amp; audio instantly</p>
            </div>
          </Link>
          <a href="https://github.com/ramishenouda/instagram-downloader" className="github-link" target="_blank" rel="noopener noreferrer">
            <span>⭐ Open Source</span>
          </a>
        </div>
      </header>

      <div className="container">
        {/* Download Card */}
        <div className="card">
          <div className="features">
            <div className="feature-item feature-item--youtube">
              <span className="feature-icon">✨</span>
              <span>Simple &amp; Fast</span>
            </div>
            <div className="feature-item feature-item--youtube">
              <span className="feature-icon">🎵</span>
              <span>Audio Support</span>
            </div>
            <div className="feature-item feature-item--youtube">
              <span className="feature-icon">🔒</span>
              <span>Privacy First</span>
            </div>
          </div>

          <form onSubmit={handleDownload} className="download-form">
            <div className="form-group">
              <label htmlFor="url-input" className="input-label">Paste YouTube URL</label>
              <input
                id="url-input"
                type="text"
                placeholder="https://youtube.com/watch?v=... or youtu.be/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="input-field input-field--youtube"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quality-select" className="input-label">Quality</label>
              <select
                id="quality-select"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                disabled={loading}
                className="input-field select-field"
              >
                {QUALITY_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="btn btn-youtube btn-full"
            >
              {loading ? (
                <><span className="spinner"></span> Downloading...</>
              ) : (
                '⬇️ Download'
              )}
            </button>
          </form>

          {result && <VideoResult videoUrl={result.videoUrl} videoTitle={result.title} />}
        </div>

        {/* What Can You Download */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>What Can You Download?</h2>
          <p>VideoSnap supports all YouTube content types:</p>
          <ul>
            <li><strong>🎬 Videos:</strong> Full-length YouTube videos in multiple qualities</li>
            <li><strong>⚡ Shorts:</strong> Short-form YouTube Shorts content</li>
            <li><strong>📺 Live Streams:</strong> Download recordings of live streams (if available)</li>
            <li><strong>🎵 Audio:</strong> Extract audio as MP3 from any video</li>
            <li><strong>📽️ Playlists:</strong> Download entire playlists (coming soon in batch downloader)</li>
          </ul>
        </div>

        {/* Quality Explanation */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>Quality Options</h2>
          <p>Choose the quality that best fits your needs:</p>
          <ul>
            <li>
              <strong>1080p (Full HD):</strong> Highest quality video, best for watching on large screens. File size: ~50-200MB per minute
            </li>
            <li>
              <strong>720p (HD):</strong> Great quality for most uses. File size: ~15-50MB per minute
            </li>
            <li>
              <strong>480p (SD):</strong> Lower quality but smaller file size. File size: ~5-15MB per minute
            </li>
            <li>
              <strong>Audio Only (MP3):</strong> Extract just the audio. Perfect for music, podcasts, or saving space. File size: ~1-3MB per minute
            </li>
          </ul>
          <p><strong>Note:</strong> Available quality depends on what YouTube provides. Some videos may not have all quality options.</p>
        </div>

        {/* How to Download */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>How to Download YouTube Videos</h2>
          <ol style={{ lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>
              <strong>Copy the YouTube URL</strong><br />
              Open YouTube and find the video you want to download. Copy the URL from your browser's address bar.
            </li>
            <li>
              <strong>Paste the URL</strong><br />
              Return to this page and paste the link into the URL input field.
            </li>
            <li>
              <strong>Choose Quality</strong><br />
              Select your preferred quality using the dropdown menu (1080p, 720p, 480p, or Audio Only).
            </li>
            <li>
              <strong>Click Download</strong><br />
              Press the "⬇️ Download" button and wait for the download to complete.
            </li>
            <li>
              <strong>Save the File</strong><br />
              Your browser will prompt you to save the file. Choose a location and click "Save".
            </li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>Troubleshooting</h2>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ "Video not available"</h3>
              <p>
                <strong>Solution:</strong> The video might be private, deleted, or age-restricted. Try with another video to confirm the service is working.
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ 1080p not available</h3>
              <p>
                <strong>Solution:</strong> Not all YouTube videos are uploaded in 1080p. Try a lower quality (720p or 480p) or a different video.
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ Download is slow</h3>
              <p>
                <strong>Solution:</strong> Large files take time to download. This depends on your internet speed and the video length. Try a lower quality or a shorter video.
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ "Failed to extract audio"</h3>
              <p>
                <strong>Solution:</strong> Some videos have audio restrictions. Try downloading the video first (not audio-only), or try a different video.
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ Downloaded file is corrupt</h3>
              <p>
                <strong>Solution:</strong> The download may have been interrupted. Try again, and make sure your internet connection is stable.
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Responsibility */}
        <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f9f7f4' }}>
          <h2>⚠️ Important</h2>
          <p>
            <strong>Respect Copyright:</strong> Only download videos you have permission to download. Respect YouTube's Terms of Service and copyright laws.
          </p>
          <p>
            <strong>Personal Use Only:</strong> This tool is for downloading your own content or content with permission. Do not repost or distribute copyrighted content as your own.
          </p>
          <p>
            <strong>Creator Support:</strong> If you enjoy the content, consider supporting creators directly through YouTube, Patreon, or other platforms.
          </p>
        </div>

        {/* Related Tools */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>Also Available</h2>
          <p>Need to download from other platforms? Check out:</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link to="/insta" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              📸 Download Instagram Videos
            </Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>
          Made with ❤️ •{' '}
          <Link to="/">Home</Link>
          {' '}• {' '}
          <a href="https://github.com/ramishenouda/instagram-downloader" target="_blank" rel="noopener noreferrer">GitHub</a>
          {' '}• {' '}
          <Link to="/about">About</Link>
          {' '}• {' '}
          <Link to="/privacy">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}
