module.exports = (req, res) => {
  // Extract path to map
  const path = req.headers['x-now-route-matches'] || req.url || '';

  const SITE_URL = 'https://www.codeclubgecjamui.in';
  
  // Default values
  let title = 'Code Club | GEC Jamui';
  let description = 'Official Website of Code Club GEC Jamui. Empowering students to learn, build, and innovate through coding.';
  let ogImage = `${SITE_URL}/images/og/main_og.png`;

  // Path mapping
  if (path.includes('/about')) {
    title = 'About Us | Code Club GEC Jamui';
    description = 'Learn about Code Club GEC Jamui — our story, mission, vision, faculty coordinators, and the team driving innovation at Government Engineering College Jamui.';
    ogImage = `${SITE_URL}/images/og/about_og.png`;
  } else if (path.includes('/events/archive')) {
    title = 'Event Archive | Code Club GEC Jamui';
    description = 'Browse the complete archive of past workshops, hackathons, and seminars organised by Code Club GEC Jamui.';
    ogImage = `${SITE_URL}/images/og/archive_og.png`;
  } else if (path.includes('/events')) {
    title = 'Events | Code Club GEC Jamui';
    description = 'Discover upcoming workshops, hackathons, coding competitions, and tech talks organised by Code Club GEC Jamui.';
    ogImage = `${SITE_URL}/images/og/events_og.png`;
  } else if (path.includes('/announcements')) {
    title = 'Announcements | Code Club GEC Jamui';
    description = 'Stay updated with the latest announcements, opportunities, and news from Code Club GEC Jamui.';
    ogImage = `${SITE_URL}/images/og/announcement_og.png`;
  } else if (path.includes('/gallery')) {
    title = 'Gallery | Code Club GEC Jamui';
    description = 'Browse photos from Code Club GEC Jamui events — hackathons, workshops, competitions, tech talks and more.';
    ogImage = `${SITE_URL}/images/og/gallery_og.png`;
  } else if (path.includes('/join')) {
    title = 'Join Us | Code Club GEC Jamui';
    description = 'Become a member of Code Club GEC Jamui. Fill in the registration form and join a community of passionate coders and innovators.';
    ogImage = `${SITE_URL}/images/og/join_og.png`;
  } else if (path.includes('/resources')) {
    title = 'Resources | Code Club GEC Jamui';
    description = 'Access study materials, coding tutorials, and academic resources curated by Code Club GEC Jamui.';
    ogImage = `${SITE_URL}/images/og/resource_og.png`;
  } else if (path.includes('/social')) {
    title = 'Social Media | Code Club GEC Jamui';
    description = 'Follow Code Club GEC Jamui on Facebook, Instagram, X (Twitter), and LinkedIn for updates, highlights, and community news.';
    ogImage = `${SITE_URL}/images/og/social_og.png`;
  }

  // Construct a minimal valid HTML response with the targeted META tags
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <meta name="description" content="${description}">
      <link rel="canonical" href="${SITE_URL}${path}" />
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="${SITE_URL}${path}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${ogImage}">

      <!-- Twitter -->
      <meta property="twitter:card" content="summary_large_image">
      <meta property="twitter:url" content="${SITE_URL}${path}">
      <meta property="twitter:title" content="${title}">
      <meta property="twitter:description" content="${description}">
      <meta property="twitter:image" content="${ogImage}">
    </head>
    <body>
      <h1>${title}</h1>
      <p>${description}</p>
      <p>Please wait to be redirected to the full Code Club app...</p>
      <script>
        // In the extremely rare case a real browser hits this page directly, force redirect
        window.location.replace("${SITE_URL}${path}");
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); 
  res.status(200).send(html);
};
