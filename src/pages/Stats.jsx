import { useState, useEffect } from 'react';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchStats(days);
  }, [days]);

  async function fetchStats(dayCount) {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/stats?days=${dayCount}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/logo.svg" alt="VideoSnap Logo" className="app-icon-img" />
            <div>
              <h1 className="app-title">VideoSnap Stats</h1>
              <p className="app-subtitle">Analytics & Usage Statistics</p>
            </div>
          </div>
          <a href="/" className="github-link">← Back Home</a>
        </div>
      </header>

      <div className="container">
        <div className="stats-page">
          {/* Time Range Selector */}
          <div className="stats-controls">
            <label>Time Range:</label>
            <select value={days} onChange={(e) => setDays(parseInt(e.target.value))} className="select-field">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading statistics...</div>
          ) : stats ? (
            <>
              {/* Page Views Summary */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>👥 Total Visitors</h3>
                  <div className="stat-value">{stats.pageviews?.unique_sessions || 0}</div>
                  <p className="stat-label">unique visitors</p>
                </div>

                <div className="stat-card">
                  <h3>📊 Page Views</h3>
                  <div className="stat-value">{stats.pageviews?.total_pageviews || 0}</div>
                  <p className="stat-label">total visits</p>
                </div>

                <div className="stat-card">
                  <h3>💾 Data Downloaded</h3>
                  <div className="stat-value">{formatBytes(stats.downloads?.reduce((sum, d) => sum + (d.total_size || 0), 0) || 0)}</div>
                  <p className="stat-label">total size</p>
                </div>

                <div className="stat-card">
                  <h3>⬇️ Total Downloads</h3>
                  <div className="stat-value">{stats.downloads?.reduce((sum, d) => sum + (d.total_downloads || 0), 0) || 0}</div>
                  <p className="stat-label">videos downloaded</p>
                </div>
              </div>

              {/* Page Views by Platform */}
              {stats.pageviewsByPlatform && stats.pageviewsByPlatform.length > 0 && (
                <div className="stats-section">
                  <h2>Visits by Platform</h2>
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>Platform</th>
                        <th>Page Views</th>
                        <th>Unique Visitors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.pageviewsByPlatform.map((p) => (
                        <tr key={p.platform}>
                          <td className="platform-name">
                            {p.platform === 'youtube' ? '▶️ YouTube' : '📸 Instagram'}
                          </td>
                          <td>{p.views}</td>
                          <td>{p.unique_sessions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Downloads by Platform */}
              <div className="stats-section">
                <h2>Downloads by Platform</h2>
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Platform</th>
                      <th>Downloads</th>
                      <th>Unique Users</th>
                      <th>Total Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.downloads?.map((platform) => (
                      <tr key={platform.platform}>
                        <td className="platform-name">
                          {platform.platform === 'youtube' ? '▶️ YouTube' : '📸 Instagram'}
                        </td>
                        <td>{platform.total_downloads}</td>
                        <td>{platform.unique_users}</td>
                        <td>{formatBytes(platform.total_size || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top Countries */}
              {stats.topCountries && stats.topCountries.length > 0 && (
                <div className="stats-section">
                  <h2>Top Countries</h2>
                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Downloads</th>
                        <th>Unique Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topCountries.map((country, idx) => (
                        <tr key={idx}>
                          <td className="country-code">{country.country}</td>
                          <td>{country.count}</td>
                          <td>{country.unique_users}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="error">Failed to load statistics</div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>VideoSnap Analytics • Data is private and never shared</p>
      </footer>
    </div>
  );
}
