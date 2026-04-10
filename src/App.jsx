import { useState } from 'react';
import { fetchInstagramVideo } from './api/instagram';
import VideoResult from './components/VideoResult';

function App() {
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
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img src={`${import.meta.env.BASE_URL}/logo.svg`} alt="VideoSnap Logo" className="app-icon-img" />
            <div>
              <h1 className="app-title">VideoSnap</h1>
              <p className="app-subtitle">Download Instagram videos, reels & posts instantly</p>
            </div>
          </div>
          <a href="https://github.com/ramishenouda/instagram-downloader" className="github-link" target="_blank" rel="noopener noreferrer">
            <span>⭐ Open Source</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="container">
        <div className="card">
          {/* Features */}
          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>Simple & Fast</span>
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

          {/* Download Form */}
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
                <>
                  <span className="spinner"></span> Downloading...
                </>
              ) : (
                '⬇️ Download'
              )}
            </button>
          </form>

          {/* Video Result */}
          {result && <VideoResult videoUrl={result.videoUrl} videoTitle={result.title} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Made with ❤️ • 
          <a href="https://github.com/ramishenouda/instagram-downloader" target="_blank" rel="noopener noreferrer"> GitHub </a>
          • Open Source & Self-Hosted
        </p>
      </footer>
    </div>
  );
}

export default App;
