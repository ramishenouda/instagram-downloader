import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchInstagramVideo } from '../api/instagram';
import VideoResult from '../components/VideoResult';

export default function InstaPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Please enter an Instagram URL');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchInstagramVideo(url);
      setResult(data);
      setUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-section logo-link">
            <img src="/logo.svg" alt="VideoSnap Logo" className="app-icon-img" />
            <div>
              <h1 className="app-title">VideoSnap</h1>
              <p className="app-subtitle">Download Instagram videos, reels &amp; posts instantly</p>
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
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>Simple &amp; Fast</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Privacy First</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <span>Self-Hosted</span>
            </div>
          </div>

          <form onSubmit={handleDownload} className="download-form">
            <div className="form-group">
              <label htmlFor="url-input" className="input-label">Paste Instagram URL</label>
              <input
                id="url-input"
                type="text"
                placeholder="https://instagram.com/p/... or /reels/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="input-field"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="btn btn-primary btn-full"
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
