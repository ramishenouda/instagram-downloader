import { Helmet } from 'react-helmet-async';
import { getMetadata } from '../lib/metadata.js';

export default function PageMeta({ pathname }) {
  const metadata = getMetadata(pathname);

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:url" content={metadata.ogUrl} />
      <link rel="canonical" href={metadata.ogUrl} />
    </Helmet>
  );
}
