// Use backend API server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/download';

const INSTAGRAM_URL_PATTERN = /^https?:\/\/(www\.)?instagram\.com\//i;

export async function fetchInstagramVideo(url) {
  // Validate URL
  if (!url || !url.trim()) {
    throw new Error('Please enter an Instagram URL');
  }

  if (!INSTAGRAM_URL_PATTERN.test(url)) {
    throw new Error('Please enter a valid Instagram URL (instagram.com)');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url.trim(),
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
    // Re-throw with better error message if it's already a custom error
    if (err.message.startsWith('Invalid') || err.message.startsWith('Could') || err.message.startsWith('Post') || err.message.startsWith('Photos') || err.message.startsWith('Please') || err.message.startsWith('API')) {
      throw err;
    }
    // Network or other errors
    throw new Error(`Failed to fetch video: ${err.message}`);
  }
}
