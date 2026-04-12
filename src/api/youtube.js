const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api/youtube`;

const YOUTUBE_URL_PATTERN = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i;

export async function fetchYoutubeVideo(url, quality = '1080') {
  if (!url || !url.trim()) {
    throw new Error('Please enter a YouTube URL');
  }

  if (!YOUTUBE_URL_PATTERN.test(url)) {
    throw new Error('Please enter a valid YouTube URL (youtube.com or youtu.be)');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url.trim(),
        quality,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.videoUrl && data.title) {
      return {
        videoUrl: data.videoUrl,
        title: data.title,
      };
    }

    throw new Error('Invalid response format from backend');
  } catch (err) {
    if (
      err.message.startsWith('Please') ||
      err.message.startsWith('Video') ||
      err.message.startsWith('Could') ||
      err.message.startsWith('Invalid') ||
      err.message.startsWith('HTTP')
    ) {
      throw err;
    }
    throw new Error(`Failed to fetch video: ${err.message}`);
  }
}
