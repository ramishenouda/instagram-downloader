import { Link } from 'react-router-dom';

export default function AboutPage() {
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
          <Link to="/" className="github-link">
            <span>← Back Home</span>
          </Link>
        </div>
      </header>

      <div className="container">
        <div className="card">
          <h1>About VideoSnap</h1>

          <h2>Our Mission</h2>
          <p>
            VideoSnap is a free, open-source video downloader designed to give you control over your digital content. We believe downloading videos from social media should be simple, fast, and private — no sign-ups, no ads, no tracking.
          </p>

          <h2>What We Do</h2>
          <p>
            VideoSnap lets you download videos, reels, and content from:
          </p>
          <ul>
            <li>📸 <strong>Instagram:</strong> Posts, Reels, Stories, and Albums</li>
            <li>▶️ <strong>YouTube:</strong> Videos, Shorts, and Playlists</li>
            <li>And more platforms via our Cobalt API integration</li>
          </ul>

          <h2>Why Open Source?</h2>
          <p>
            We believe in transparency. Our code is open-source because:
          </p>
          <ul>
            <li><strong>Transparency:</strong> You can see exactly what we do with your requests</li>
            <li><strong>Community:</strong> Anyone can contribute improvements and fixes</li>
            <li><strong>Trust:</strong> No hidden tracking, no data selling</li>
            <li><strong>Sustainability:</strong> Open source projects last longer and evolve with user needs</li>
          </ul>

          <h2>Key Values</h2>
          <ul>
            <li>🔒 <strong>Privacy First:</strong> No sign-ups, no tracking, no ads</li>
            <li>⚡ <strong>Fast:</strong> Optimized downloads with minimal waiting</li>
            <li>🎁 <strong>Free Forever:</strong> No premium tiers, no paywalls</li>
            <li>🛠️ <strong>Self-Hosted:</strong> All infrastructure is ours; no dependency on third-party vendors</li>
            <li>🔧 <strong>Open Source:</strong> Code is publicly available on GitHub</li>
          </ul>

          <h2>Technology</h2>
          <p>
            VideoSnap is built with modern web technologies:
          </p>
          <ul>
            <li><strong>Frontend:</strong> React + Vite for fast, responsive UI</li>
            <li><strong>Backend:</strong> Node.js proxy server with Express</li>
            <li><strong>API:</strong> Cobalt API for Instagram/YouTube support</li>
            <li><strong>Infrastructure:</strong> Docker containerization for easy deployment</li>
            <li><strong>Hosting:</strong> Self-hosted on Hostinger VPS</li>
          </ul>

          <h2>Legal</h2>
          <p>
            VideoSnap is licensed under the <strong>MIT License</strong>. This means:
          </p>
          <ul>
            <li>✅ You can use VideoSnap for personal projects</li>
            <li>✅ You can modify and redistribute the code</li>
            <li>✅ You can use it commercially (with attribution)</li>
            <li>⚠️ Downloading video content is your responsibility. Check local laws.</li>
          </ul>

          <p>
            <strong>Disclaimer:</strong> VideoSnap is a tool for downloading videos. Users are responsible for ensuring they have the right to download and use content from social media platforms. We do not endorse copyright infringement.
          </p>

          <h2>Get Involved</h2>
          <p>
            Love VideoSnap? Here's how to contribute:
          </p>
          <ul>
            <li>⭐ <strong>Star on GitHub:</strong> Show support and help others discover the project</li>
            <li>🐛 <strong>Report Bugs:</strong> Found an issue? Open a GitHub issue</li>
            <li>💡 <strong>Suggest Features:</strong> Have an idea? Let us know via GitHub Discussions</li>
            <li>🔧 <strong>Submit PRs:</strong> Code improvements welcome!</li>
            <li>📣 <strong>Share:</strong> Tell friends and communities about VideoSnap</li>
          </ul>

          <h2>Links</h2>
          <ul>
            <li>
              <a href="https://github.com/ramishenouda/instagram-downloader" target="_blank" rel="noopener noreferrer">
                ⭐ GitHub Repository
              </a>
            </li>
            <li>
              <a href="https://github.com/ramishenouda/instagram-downloader/issues" target="_blank" rel="noopener noreferrer">
                🐛 Report Issues
              </a>
            </li>
            <li>
              <a href="https://github.com/ramishenouda/instagram-downloader/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">
                📄 MIT License
              </a>
            </li>
          </ul>

          <hr />

          <h2>Questions?</h2>
          <p>
            If you have questions, feedback, or want to get in touch, please open an issue on our GitHub repository or reach out through the community.
          </p>
        </div>
      </div>

      <footer className="footer">
        <p>
          Made with ❤️ •{' '}
          <Link to="/">Home</Link>
          {' '}• {' '}
          <a href="https://github.com/ramishenouda/instagram-downloader" target="_blank" rel="noopener noreferrer">GitHub</a>
          {' '}• {' '}
          <Link to="/privacy">Privacy</Link>
          {' '}• Open Source &amp; Self-Hosted
        </p>
      </footer>
    </div>
  );
}
