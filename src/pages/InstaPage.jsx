import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchInstagramVideo } from '../api/instagram';
import VideoResult from '../components/VideoResult';

export default function InstaPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Log pageview on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/pageview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 'instagram' }),
    }).catch(console.error);
  }, []);

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
        {/* Download Card */}
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

        {/* What Can You Download */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>What Can You Download?</h2>
          <p>VideoSnap supports all major Instagram content types:</p>
          <ul>
            <li><strong>📸 Posts:</strong> Single photos and captions</li>
            <li><strong>🎬 Reels:</strong> Short-form videos</li>
            <li><strong>📱 Stories:</strong> Temporary content (if public)</li>
            <li><strong>🖼️ Albums:</strong> Multi-photo/video posts</li>
            <li><strong>🎥 IGTV:</strong> Longer-form videos</li>
          </ul>
        </div>

        {/* How to Download */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>How to Download Instagram Videos</h2>
          <ol style={{ lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>
              <strong>Copy the Instagram URL</strong><br />
              Open Instagram and find the post/reel you want to download. Tap the three dots (⋯) and select "Copy Link".
            </li>
            <li>
              <strong>Paste the URL</strong><br />
              Return to this page and paste the link into the input field above.
            </li>
            <li>
              <strong>Click Download</strong><br />
              Press the "⬇️ Download" button and wait a few seconds.
            </li>
            <li>
              <strong>Save the Video</strong><br />
              Your browser will prompt you to save the file. Choose your destination and click "Save".
            </li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>Troubleshooting</h2>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ "Error: Could not download"</h3>
              <p>
                <strong>Solution:</strong> Make sure the URL is correct and the post is publicly accessible. Private accounts and deleted posts will fail.
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ Download doesn't start</h3>
              <p>
                <strong>Solution:</strong> Check your browser's download settings. Some browsers may block downloads depending on your security settings. Allow VideoSnap to download files.
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ "Cannot download Story"</h3>
              <p>
                <strong>Solution:</strong> Instagram Stories expire after 24 hours and may have visibility restrictions. Try downloading within the 24-hour window.
              </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>❌ Video quality is low</h3>
              <p>
                <strong>Solution:</strong> We download at the highest quality available. The video quality depends on what Instagram provides. 1080p+ videos may not be available for all content.
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Responsibility */}
        <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f9f7f4' }}>
          <h2>⚠️ Important</h2>
          <p>
            <strong>Respect Content Creators:</strong> Downloading content is your responsibility. Make sure you have permission from the content creator. Respect copyright laws in your jurisdiction.
          </p>
          <p>
            <strong>Personal Use Only:</strong> This tool is for downloading your own content or content with permission. Do not use to repost content as your own.
          </p>
        </div>

        {/* Related Tools */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2>Also Available</h2>
          <p>Need to download from other platforms? Check out:</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Link to="/youtube" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              ▶️ Download YouTube Videos
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
