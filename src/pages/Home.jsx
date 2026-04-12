import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/logo.svg" alt="VideoSnap Logo" className="app-icon-img" />
            <div>
              <h1 className="app-title">VideoSnap</h1>
              <p className="app-subtitle">Free video downloader — no sign-up needed</p>
            </div>
          </div>
          <a href="https://github.com/ramishenouda/instagram-downloader" className="github-link" target="_blank" rel="noopener noreferrer">
            <span>⭐ Open Source</span>
          </a>
        </div>
      </header>

      <div className="container">
        <div className="home-hero">
          <h2 className="home-hero-title">Download videos from anywhere</h2>
          <p className="home-hero-subtitle">Pick a platform to get started — free, fast, and private.</p>

          <div className="platform-grid">
            <Link to="/insta" className="platform-card platform-card--instagram">
              <span className="platform-card-icon">📸</span>
              <h3 className="platform-card-title">Instagram</h3>
              <p className="platform-card-desc">Reels, posts &amp; stories</p>
              <span className="platform-card-cta">Download →</span>
            </Link>

            <Link to="/youtube" className="platform-card platform-card--youtube">
              <span className="platform-card-icon">▶️</span>
              <h3 className="platform-card-title">YouTube</h3>
              <p className="platform-card-desc">Videos, shorts &amp; audio</p>
              <span className="platform-card-cta">Download →</span>
            </Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>
          Made with ❤️ •{' '}
          <a href="https://github.com/ramishenouda/instagram-downloader" target="_blank" rel="noopener noreferrer"> GitHub </a>
          • <a href="/stats">Stats</a>
          • Open Source &amp; Self-Hosted
        </p>
      </footer>
    </div>
  );
}
