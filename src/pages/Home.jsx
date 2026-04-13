import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: 'Is VideoSnap safe to use?',
      answer: 'Yes! VideoSnap is entirely local and transparent. We do not track you, store your videos, or collect personal data. All processing happens on our open-source infrastructure.',
    },
    {
      id: 2,
      question: 'Do I need to create an account?',
      answer: 'No account creation is required! VideoSnap works without sign-ups. Just paste a link and download. Completely anonymous.',
    },
    {
      id: 3,
      question: 'What can I download?',
      answer: 'Instagram: Posts, Reels, Stories, and Albums. More platforms coming soon!',
    },
    {
      id: 4,
      question: 'Is downloading videos legal?',
      answer: 'Downloading for personal use is generally legal, but always check the content creator\'s rights and your local laws. VideoSnap is a tool; responsibility lies with the user.',
    },
    {
      id: 5,
      question: 'Does VideoSnap have ads?',
      answer: 'No ads, ever. VideoSnap is free and open-source, supported by community contributions.',
    },
    {
      id: 6,
      question: 'Can I use VideoSnap on mobile?',
      answer: 'Yes! VideoSnap is fully responsive and works on mobile browsers. Just visit videosnap.fun on your phone.',
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

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
        {/* Hero Section */}
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
          </div>
        </div>

        {/* Why Use VideoSnap */}
        <div className="card" style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '2rem' }}>Why Choose VideoSnap?</h2>
          <div className="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div className="feature-item" style={{ textAlign: 'center' }}>
              <span className="feature-icon" style={{ fontSize: '2rem' }}>✨</span>
              <h3 style={{ marginTop: '1rem' }}>No Watermarks</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Download clean, original content without watermarks added.</p>
            </div>
            <div className="feature-item" style={{ textAlign: 'center' }}>
              <span className="feature-icon" style={{ fontSize: '2rem' }}>🚀</span>
              <h3 style={{ marginTop: '1rem' }}>Lightning Fast</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Optimized for speed. Download videos in seconds.</p>
            </div>
            <div className="feature-item" style={{ textAlign: 'center' }}>
              <span className="feature-icon" style={{ fontSize: '2rem' }}>🔒</span>
              <h3 style={{ marginTop: '1rem' }}>Privacy First</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>No tracking, no ads, no data collection. Completely anonymous.</p>
            </div>
            <div className="feature-item" style={{ textAlign: 'center' }}>
              <span className="feature-icon" style={{ fontSize: '2rem' }}>🎁</span>
              <h3 style={{ marginTop: '1rem' }}>100% Free</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Free forever. No sign-up, no premium tiers, no paywalls.</p>
            </div>
            <div className="feature-item" style={{ textAlign: 'center' }}>
              <span className="feature-icon" style={{ fontSize: '2rem' }}>🛠️</span>
              <h3 style={{ marginTop: '1rem' }}>Self-Hosted</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>All infrastructure is ours. No third-party dependency.</p>
            </div>
            <div className="feature-item" style={{ textAlign: 'center' }}>
              <span className="feature-icon" style={{ fontSize: '2rem' }}>🔧</span>
              <h3 style={{ marginTop: '1rem' }}>Open Source</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Code is public. See exactly what we do. Community-driven.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="card" style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '2rem' }}>Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqItems.map((item) => (
              <div
                key={item.id}
                style={{
                  borderBottom: '1px solid #e0e0e0',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => toggleFaq(item.id)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#333',
                  }}
                >
                  <span>{item.question}</span>
                  <span style={{ fontSize: '1.2rem', color: '#667eea' }}>
                    {expandedFaq === item.id ? '−' : '+'}
                  </span>
                </div>
                {expandedFaq === item.id && (
                  <p style={{ marginTop: '1rem', color: '#666', lineHeight: '1.6' }}>
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
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
          <Link to="/stats">Stats</Link>
          {' '}• {' '}
          <Link to="/about">About</Link>
          {' '}• {' '}
          <Link to="/privacy">Privacy</Link>
          {' '}• Open Source &amp; Self-Hosted
        </p>
      </footer>
    </div>
  );
}
