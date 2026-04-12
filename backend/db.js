const { Pool } = require('pg');
const geoip = require('geoip-lite');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize database tables on startup
async function initializeDb() {
  const client = await pool.connect();
  try {
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT NOW(),
        page VARCHAR(50),
        ip VARCHAR(45),
        country VARCHAR(2),
        user_agent TEXT,
        session_id VARCHAR(36)
      );

      CREATE TABLE IF NOT EXISTS downloads (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT NOW(),
        platform VARCHAR(20),
        url_hash VARCHAR(64),
        quality VARCHAR(20),
        ip VARCHAR(45),
        country VARCHAR(2),
        file_size BIGINT,
        user_agent TEXT,
        session_id VARCHAR(36)
      );

      -- Indexes for faster queries
      CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
      CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);
      CREATE INDEX IF NOT EXISTS idx_downloads_timestamp ON downloads(timestamp);
      CREATE INDEX IF NOT EXISTS idx_downloads_platform ON downloads(platform);
      CREATE INDEX IF NOT EXISTS idx_downloads_country ON downloads(country);
    `);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Get country from IP
function getCountryFromIp(ip) {
  if (ip === 'localhost' || ip === '127.0.0.1' || ip === '::1') {
    return 'LOCAL';
  }
  try {
    const geo = geoip.lookup(ip);
    return geo?.country || 'UNKNOWN';
  } catch (e) {
    return 'UNKNOWN';
  }
}

// Log a page view
async function logPageView(page, ip, userAgent, sessionId) {
  try {
    const country = getCountryFromIp(ip);
    await pool.query(
      `INSERT INTO page_views (page, ip, country, user_agent, session_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [page, ip, country, userAgent, sessionId]
    );
    console.log(`[Analytics] Page view: ${page} from ${country}`);
  } catch (error) {
    console.error('[Analytics] Error logging page view:', error.message);
  }
}

// Log a download
async function logDownload(platform, urlHash, quality, ip, fileSize, userAgent, sessionId) {
  try {
    const country = getCountryFromIp(ip);
    await pool.query(
      `INSERT INTO downloads (platform, url_hash, quality, ip, country, file_size, user_agent, session_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [platform, urlHash, quality, ip, country, fileSize, userAgent, sessionId]
    );
    console.log(`[Analytics] Download: ${platform} (${quality}) from ${country} - ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
  } catch (error) {
    console.error('[Analytics] Error logging download:', error.message);
  }
}

// Get analytics stats
async function getStats(days = 7) {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_pageviews,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT ip) as unique_ips
      FROM page_views
      WHERE timestamp > NOW() - INTERVAL '${days} days'
    `);

    const downloads = await pool.query(`
      SELECT 
        platform,
        COUNT(*) as total_downloads,
        COUNT(DISTINCT session_id) as unique_users,
        SUM(file_size) as total_size
      FROM downloads
      WHERE timestamp > NOW() - INTERVAL '${days} days'
      GROUP BY platform
    `);

    const topCountries = await pool.query(`
      SELECT 
        country,
        COUNT(*) as count,
        COUNT(DISTINCT session_id) as unique_users
      FROM downloads
      WHERE timestamp > NOW() - INTERVAL '${days} days'
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `);

    return {
      pageviews: result.rows[0],
      downloads: downloads.rows,
      topCountries: topCountries.rows,
    };
  } catch (error) {
    console.error('[Analytics] Error getting stats:', error.message);
    return null;
  }
}

module.exports = {
  pool,
  initializeDb,
  logPageView,
  logDownload,
  getStats,
  getCountryFromIp,
};
