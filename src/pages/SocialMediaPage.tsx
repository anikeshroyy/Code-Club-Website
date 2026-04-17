import React from 'react';
import {
  Box, Container, Grid, Typography, Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// ── Platform config ───────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    handle: '@code.club.gec.jamui',
    url: 'https://www.facebook.com/code.club.gec.jamui',
    color: '#1877F2',
    bgGradient: 'linear-gradient(135deg, #1877F2 0%, #0d5dbf 100%)',
    icon: <FacebookIcon sx={{ fontSize: '3.5rem' }} />,
    description: 'Follow us for event updates, photo albums & club news.',
    emoji: '📘',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@codeclubgecjamui',
    url: 'https://www.instagram.com/codeclubgecjamui/',
    color: '#E1306C',
    bgGradient: 'linear-gradient(135deg, #f9a825 0%, #e1306c 50%, #833ab4 100%)',
    icon: <InstagramIcon sx={{ fontSize: '3.5rem' }} />,
    description: 'See highlights, reels & behind-the-scenes content.',
    emoji: '📸',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    handle: '@codecgecjamui',
    url: 'https://x.com/codecgecjamui',
    color: '#000000',
    bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #444 100%)',
    icon: <TwitterIcon sx={{ fontSize: '3.5rem' }} />,
    description: 'Quick updates, tech tips & programming thoughts.',
    emoji: '🐦',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Code Club GEC Jamui',
    url: 'https://www.linkedin.com/in/code-club-gec-jamui/',
    color: '#0A66C2',
    bgGradient: 'linear-gradient(135deg, #0A66C2 0%, #054c91 100%)',
    icon: <LinkedInIcon sx={{ fontSize: '3.5rem' }} />,
    description: 'Achievements, placements & professional updates.',
    emoji: '💼',
  },
];

// ── Styled ────────────────────────────────────────────────────────────────────

const HeroSection = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  minHeight: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)',
  },
}));

// ── Page ──────────────────────────────────────────────────────────────────────

const SocialMediaPage: React.FC = () => {
  return (
    <Box>
      {/* Hero */}
      <HeroSection>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <SEO
            title="Social Media"
            description="Follow Code Club GEC Jamui on Facebook, Instagram, X (Twitter), and LinkedIn for updates, highlights, and community news."
            path="/social"
          />
          <SEO
            title="Social Media"
            description="Follow Code Club GEC Jamui on Facebook, Instagram, X (Twitter), and LinkedIn for updates, highlights, and community news."
            path="/social"
          />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

            <Typography
              variant="h3"
              sx={{ color: 'white', fontWeight: 800, mb: 2, pt: 10, fontSize: { xs: '1.8rem', md: '2.8rem' } }}
            >
              Code Club on Social Media
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400, maxWidth: 520, mx: 'auto', lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.1rem' } }}
            >
              Stay connected — updates, highlights & achievements across all platforms.
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Cards grid */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={3}>
          {PLATFORMS.map((platform, i) => (
            <Grid item xs={12} sm={6} key={platform.id}>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: platform.bgGradient,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 1.5,
                    boxShadow: `0 8px 32px ${platform.color}33`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: `0 16px 48px ${platform.color}55`,
                    },
                  }}
                >
                  {/* Icon */}
                  <Box sx={{ color: 'white', opacity: 0.95, lineHeight: 1 }}>
                    {platform.icon}
                  </Box>

                  {/* Name */}
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.2 }}>
                    {platform.name}
                  </Typography>

                  {/* Handle */}
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    {platform.handle}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: 260, mt: 0.5 }}
                  >
                    {platform.description}
                  </Typography>

                  {/* Redirect button */}
                  <Tooltip title={`Open ${platform.name}`}>
                    <Box
                      component="a"
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        mt: 1.5,
                        px: 3.5,
                        py: 1.2,
                        borderRadius: 5,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        bgcolor: 'rgba(255,255,255,0.18)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.35)',
                        color: 'white',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'white',
                          color: platform.color,
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                      Follow us
                    </Box>
                  </Tooltip>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SocialMediaPage;
