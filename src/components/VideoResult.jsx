import { useState } from 'react';

export default function VideoResult({ videoUrl, videoTitle }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = videoTitle || 'instagram-video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(videoUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="video-result">
      <div className="action-buttons-result button-group">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn btn-primary"
        >
          {downloading ? 'Downloading...' : 'Download Video'}
        </button>
        <button onClick={handleCopyLink} className="btn btn-secondary">
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      <div className="video-preview">
        <video controls width="100%">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
