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
    <div className="container">
      <div className="card">
        <h1>📸 Instagram Video Downloader</h1>
        <p className="subtitle">Paste a link, download the video</p>

        <form onSubmit={handleDownload}>
          <div className="form-group">
            <input
              type="text"
              placeholder="https://instagram.com/p/..."
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
                <span className="spinner"></span> Fetching...
              </>
            ) : (
              'Download'
            )}
          </button>
        </form>

        {result && <VideoResult videoUrl={result.videoUrl} videoTitle={result.title} />}
      </div>
    </div>
  );
}

export default App;
