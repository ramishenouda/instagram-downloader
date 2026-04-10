const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Cobalt API is running on http://cobalt:8000 inside Docker network
const COBALT_URL = process.env.COBALT_URL || 'http://cobalt:8000';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Instagram Downloader Proxy is running' });
});

app.post('/api/download', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.trim()) {
      return res.status(400).json({ detail: 'Please enter an Instagram URL' });
    }

    if (!url.includes('instagram.com')) {
      return res.status(400).json({ detail: 'Please enter a valid Instagram URL' });
    }

    console.log(`[Proxy] Forwarding request to Cobalt for: ${url}`);

    // Forward request to Cobalt API
    const cobaltResponse = await axios.post(`${COBALT_URL}/`, {
      url: url.trim(),
      downloadMode: 'auto',
      filenameStyle: 'basic',
      videoQuality: '1080',
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    const data = cobaltResponse.data;

    console.log(`[Proxy] Cobalt response status: ${data.status}`);

    // Handle Cobalt response
    if (data.status === 'error') {
      const errorMsg = data.error?.code || 'Unknown error';
      console.error(`[Proxy] Cobalt error: ${JSON.stringify(data.error)}`);
      return res.status(400).json({ detail: `Cobalt error: ${errorMsg}` });
    }

    // Handle successful response (tunnel, redirect, or picker)
    if (data.status === 'tunnel' || data.status === 'redirect') {
      return res.json({
        videoUrl: data.url,
        title: data.filename || 'instagram_video.mp4',
      });
    }

    if (data.status === 'picker' && data.picker && data.picker.length > 0) {
      // Get first downloadable item
      const firstItem = data.picker[0];
      if (firstItem.url) {
        return res.json({
          videoUrl: firstItem.url,
          title: data.filename || 'instagram_video.mp4',
        });
      }
    }

    console.error(`[Proxy] Unexpected Cobalt status: ${data.status}`);
    return res.status(400).json({ detail: `Unexpected response: ${data.status}` });
  } catch (error) {
    console.error('[Proxy] Error:', error.message);
    
    if (error.response?.status === 404) {
      console.error('[Proxy] 404 Response:', JSON.stringify(error.response.data));
      return res.status(404).json({ detail: 'Post not found or Cobalt service unavailable' });
    }

    if (error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({ detail: 'Cobalt service is not running' });
    }

    res.status(500).json({ detail: `Server error: ${error.message}` });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Forwarding requests to Cobalt at: ${COBALT_URL}`);
});
