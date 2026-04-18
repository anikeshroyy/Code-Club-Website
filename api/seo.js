module.exports = async (req, res) => {
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

  try {
    // Determine exact host so it doesn't break in staging mode
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    
    // Fetch the truly compiled static index.html from the root 
    // (since root '/' doesn't point to /api/seo due to vercel.json rewrites)
    const fetchRes = await fetch(`${protocol}://${host}/`);
    let html = await fetchRes.text();

    // Safely inject the dynamically specific tags right into the original 
    // pre-bundled React index.html. Both normal users and crawlers will get this!
    html = html.replace(/<title>.*?<\/title>/i, `<title>${meta.title}</title>`);
    html = html.replace(/<meta name="description" content=".*?"\s*\/>/i, `<meta name="description" content="${meta.description}" />`);
    
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/>/i, `<meta property="og:title" content="${meta.title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?"\s*\/>/i, `<meta property="og:description" content="${meta.description}" />`);
    html = html.replace(/<meta property="og:image" content=".*?"\s*\/>/i, `<meta property="og:image" content="${meta.image}" />`);
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

    html = html.replace(/<meta property="twitter:title" content=".*?"\s*\/>/i, `<meta property="twitter:title" content="${meta.title}" />`);
    html = html.replace(/<meta property="twitter:description" content=".*?"\s*\/>/i, `<meta property="twitter:description" content="${meta.description}" />`);
    html = html.replace(/<meta property="twitter:image" content=".*?"\s*\/>/i, `<meta property="twitter:image" content="${meta.image}" />`);
    html = html.replace(/<meta property="twitter:url" content=".*?"\s*\/>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
    res.status(200).send(html);
  } catch (error) {
    console.error("SEO Proxy Fetch Error:", error);
    res.status(500).send("Error generating SEO HTML");
  }
};
