import { useState } from 'react';

export default function VideoResult({ videoUrl, videoTitle }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="video-result">
      <div className="action-buttons-result button-group">
        <a
          href={videoUrl}
          download={videoTitle || 'instagram-video'}
          className="btn btn-primary"
        >
          Download Video
        </a>
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
