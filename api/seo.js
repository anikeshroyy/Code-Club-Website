module.exports = async (req, res) => {
  // Strip origin or query params if any
  const urlPath = req.url.split('?')[0];

  const SITE_URL = 'https://www.codeclubgecjamui.in';
  
  // Default fallback
  let meta = {
    title: 'Code Club | GEC Jamui',
    description: 'Official website of Code Club GEC Jamui. Empowering students to learn, build, and innovate through coding, hackathons, and tech events.',
    image: `${SITE_URL}/images/og/main_og.png`
  };

  // Route specific metadata
  if (urlPath.includes('/about')) {
    meta = {
      title: 'About Us | Code Club GEC Jamui',
      description: 'Learn about Code Club GEC Jamui — our story, mission, vision, faculty coordinators, and the team driving innovation at Government Engineering College Jamui.',
      image: `${SITE_URL}/images/og/about_og.png`
    };
  } else if (urlPath.includes('/events/archive')) {
    meta = {
      title: 'Event Archive | Code Club GEC Jamui',
      description: 'Browse the complete archive of past workshops, hackathons, and seminars organised by Code Club GEC Jamui.',
      image: `${SITE_URL}/images/og/archive_og.png`
    };
  } else if (urlPath.includes('/events')) {
    meta = {
      title: 'Events | Code Club GEC Jamui',
      description: 'Discover upcoming workshops, hackathons, coding competitions, and tech talks organised by Code Club GEC Jamui.',
      image: `${SITE_URL}/images/og/events_og.png`
    };
  } else if (urlPath.includes('/announcements')) {
    meta = {
      title: 'Announcements | Code Club GEC Jamui',
      description: 'Stay updated with the latest announcements, opportunities, and news from Code Club GEC Jamui.',
      image: `${SITE_URL}/images/og/announcement_og.png`
    };
  } else if (urlPath.includes('/gallery')) {
    meta = {
      title: 'Gallery | Code Club GEC Jamui',
      description: 'Browse photos from Code Club GEC Jamui events — hackathons, workshops, competitions, tech talks and more.',
      image: `${SITE_URL}/images/og/gallery_og.png`
    };
  } else if (urlPath.includes('/join')) {
    meta = {
      title: 'Join Us | Code Club GEC Jamui',
      description: 'Become a member of Code Club GEC Jamui. Fill in the registration form and join a community of passionate coders and innovators.',
      image: `${SITE_URL}/images/og/join_og.png`
    };
  } else if (urlPath.includes('/resources')) {
    meta = {
      title: 'Resources | Code Club GEC Jamui',
      description: 'Access study materials, coding tutorials, and academic resources curated by Code Club GEC Jamui.',
      image: `${SITE_URL}/images/og/resource_og.png`
    };
  } else if (urlPath.includes('/social')) {
    meta = {
      title: 'Social Media | Code Club GEC Jamui',
      description: 'Follow Code Club GEC Jamui on Facebook, Instagram, X (Twitter), and LinkedIn for updates, highlights, and community news.',
      image: `${SITE_URL}/images/og/social_og.png`
    };
  }

  const canonicalUrl = `${SITE_URL}${urlPath}`;

  // We are only returning the <head> block metadata required by Social Platforms
  // This is safe because only specific crawler User-Agents are routed here.
  const htmlResult = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="Code Club GEC Jamui" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@codecgecjamui" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${meta.image}" />
</head>
<body>
  <h1>${meta.title}</h1>
  <p>${meta.description}</p>
  <!-- Social Crawlers will extract metadata from the head directly -->
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200'); // Cache for 24h
  res.status(200).send(htmlResult);
};
