import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.codeclubgecjamui.in';
const MAIN_OG = `${SITE_URL}/images/og/main_og.png`;

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, path = '', image }) => {
  const fullTitle  = `${title} | Code Club GEC Jamui`;
  const canonical  = `${SITE_URL}${path}`;

  // Automatically determine the default OG image based on the path
  let defaultOgImage = MAIN_OG;
  if (path.includes('/about')) defaultOgImage = `${SITE_URL}/images/og/about_og.png`;
  else if (path.includes('/events/archive')) defaultOgImage = `${SITE_URL}/images/og/archive_og.png`;
  else if (path.includes('/events')) defaultOgImage = `${SITE_URL}/images/og/events_og.png`;
  else if (path.includes('/announcements')) defaultOgImage = `${SITE_URL}/images/og/announcement_og.png`;
  else if (path.includes('/gallery')) defaultOgImage = `${SITE_URL}/images/og/gallery_og.png`;
  else if (path.includes('/join')) defaultOgImage = `${SITE_URL}/images/og/join_og.png`;
  else if (path.includes('/resources')) defaultOgImage = `${SITE_URL}/images/og/resource_og.png`;
  else if (path.includes('/social')) defaultOgImage = `${SITE_URL}/images/og/social_og.png`;

  const ogImage = image ?? defaultOgImage;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:url"         content={canonical} />
      <meta property="og:site_name"   content="Code Club GEC Jamui" />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:image:width"  content="512" />
      <meta property="og:image:height" content="512" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:url"         content={canonical} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />
      <meta name="twitter:site"        content="@codecgecjamui" />
    </Helmet>
  );
};

export default SEO;
