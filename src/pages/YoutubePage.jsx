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
      </div>

      <footer className="footer">
        <p>
          Made with ❤️ •{' '}
          <a href="https://github.com/ramishenouda/instagram-downloader" target="_blank" rel="noopener noreferrer"> GitHub </a>
          • Open Source &amp; Self-Hosted
        </p>
      </footer>
    </div>
  );
}
