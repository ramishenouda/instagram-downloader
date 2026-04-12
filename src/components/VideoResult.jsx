import { useState, useEffect } from 'react';

export default function VideoResult({ videoUrl, videoTitle }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);

  // Preload the video blob when component mounts — this happens once
  useEffect(() => {
    let isMounted = true;
    preloadVideo();

    async function preloadVideo() {
      try {
        const response = await fetch(videoUrl);
        const total = parseInt(response.headers.get('content-length') || '0', 10);
        let loaded = 0;

        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          if (isMounted) setProgress(Math.round((loaded / total) * 100));
        }

        const blob = new Blob(chunks, { type: 'video/mp4' });
        if (isMounted) {
          setVideoBlobUrl(URL.createObjectURL(blob));
          setProgress(0); // Reset progress
        }
      } catch (error) {
        console.error('Preload failed:', error);
      }
    }

    return () => { isMounted = false; };
  }, [videoUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!videoBlobUrl) return;

    const a = document.createElement('a');
    a.href = videoBlobUrl;
    a.download = videoTitle || 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="video-result">
      <div className="action-buttons-result button-group">
        {/* Preload progress */}
        {!videoBlobUrl && progress > 0 && (
          <button disabled className="btn btn-primary">
            Loading {progress}%
          </button>
        )}
        {videoBlobUrl && (
          <button onClick={handleDownload} className="btn btn-primary">
            Download Video
          </button>
        )}
        <button onClick={handleCopyLink} className="btn btn-secondary">
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      {/* Preload progress bar */}
      {!videoBlobUrl && progress > 0 && (
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="video-preview">
        <video controls width="100%">
          <source src={videoBlobUrl || videoUrl} />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
