// Metadata configuration for each page
export const metadataConfig = {
  '/': {
    title: 'VideoSnap - Download Instagram & YouTube Videos Free',
    description: 'Free video downloader for Instagram and YouTube. Download reels, posts, videos, and audio without sign-up. Private, fast, and open-source.',
    ogUrl: 'https://videosnap.fun/',
  },
  '/insta': {
    title: 'Download Instagram Videos, Reels & Posts Free | VideoSnap',
    description: 'Download Instagram videos, reels, stories, and posts instantly. No watermarks, no sign-up. Fast, private, and free.',
    ogUrl: 'https://videosnap.fun/insta',
  },
  '/youtube': {
    title: 'Download YouTube Videos & Shorts Free in HD | VideoSnap',
    description: 'Download YouTube videos, shorts, and audio (MP3) in multiple qualities. Free, fast, and completely private.',
    ogUrl: 'https://videosnap.fun/youtube',
  },
  '/stats': {
    title: 'Usage Statistics | VideoSnap',
    description: 'See how many videos are downloaded on VideoSnap. Real-time statistics and download trends.',
    ogUrl: 'https://videosnap.fun/stats',
  },
  '/about': {
    title: 'About VideoSnap - Free Open Source Video Downloader',
    description: 'Learn about VideoSnap: a free, open-source video downloader built for privacy and simplicity. No ads, no tracking, self-hosted.',
    ogUrl: 'https://videosnap.fun/about',
  },
  '/privacy': {
    title: 'Privacy Policy | VideoSnap',
    description: 'VideoSnap privacy policy. We collect no personal data. Privacy-first video downloader with zero tracking.',
    ogUrl: 'https://videosnap.fun/privacy',
  },
};

export const getMetadata = (pathname) => {
  return metadataConfig[pathname] || metadataConfig['/'];
};
