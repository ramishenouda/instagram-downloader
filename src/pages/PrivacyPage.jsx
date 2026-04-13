import { Link } from 'react-router-dom';

export default function PrivacyPage() {
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
          <h1>Privacy Policy</h1>
          <p><strong>Last Updated:</strong> April 13, 2026</p>

          <h2>1. Introduction</h2>
          <p>
            VideoSnap ("we", "us", "our", or "the Site") is committed to protecting your privacy. This Privacy Policy explains our policies and practices regarding the collection, use, and disclosure of your information when you use our website and services.
          </p>

          <h2>2. Information We Collect</h2>
          <p><strong>VideoSnap collects minimal user data:</strong></p>
          <ul>
            <li><strong>Usage Analytics:</strong> We track page views and download counts (anonymized, no personal identifiers)</li>
            <li><strong>No Account Data:</strong> We do not require sign-ups, logins, or personal information</li>
            <li><strong>No Payment Info:</strong> VideoSnap is entirely free; we do not collect payment or financial data</li>
            <li><strong>No Downloaded Content Storage:</strong> Videos you download are NOT stored on our servers</li>
            <li><strong>No Cookies (Tracking):</strong> We do not use tracking cookies or third-party analytics for advertising</li>
          </ul>

          <h2>3. How We Use Information</h2>
          <p>The minimal data we collect is used only for:</p>
          <ul>
            <li>Understanding how the service is used (basic analytics)</li>
            <li>Improving website performance and user experience</li>
            <li>Troubleshooting technical issues</li>
          </ul>

          <h2>4. Data Storage & Security</h2>
          <ul>
            <li><strong>Self-Hosted Infrastructure:</strong> VideoSnap runs on self-hosted servers with no third-party data sharing</li>
            <li><strong>No Third-Party Services:</strong> We do not use Google Analytics, Facebook Pixel, or similar tracking tools</li>
            <li><strong>HTTPS Only:</strong> All communications are encrypted via SSL/TLS</li>
            <li><strong>No Data Retention:</strong> Analytics data is not retained long-term</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>Since we collect minimal data, requests for deletion or data access are not typically necessary. However, if you have concerns about any data we collect, please contact us.</p>

          <h2>6. External API Calls</h2>
          <p>
            VideoSnap uses third-party APIs (Cobalt, Instagram, YouTube Cobalt provider) to fetch video data. These external services may collect their own data. We do not store or log your requests to these services beyond temporary processing.
          </p>

          <h2>7. GDPR Compliance</h2>
          <p>
            VideoSnap complies with GDPR requirements. Since we collect no personal data, GDPR rights (access, deletion, portability) have minimal application. Our service is designed for privacy-first video downloading.
          </p>

          <h2>8. Children's Privacy</h2>
          <p>
            VideoSnap is not directed towards children under 13. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of the service constitutes acceptance of changes.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our privacy practices, please open an issue on our <a href="https://github.com/ramishenouda/instagram-downloader" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
          </p>

          <hr />
          
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
            <strong>Summary:</strong> VideoSnap is privacy-first. No sign-ups, no tracking, no ads. Videos are not stored on our servers. All your data stays with you.
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
          <Link to="/about">About</Link>
          {' '}• Open Source &amp; Self-Hosted
        </p>
      </footer>
    </div>
  );
}
