import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Button, Chip, useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  CalendarToday, AccessTime, LocationOn, ArrowBack, Inventory2,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import API_BASE from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  status: string;
}

// ── Styled Components ─────────────────────────────────────────────────────────

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(14, 0, 10),
  textAlign: 'center',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #434343 0%, #000000 100%)'
    : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  overflow: 'hidden',
  '&::before': {
    content: '""', position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(255,255,255,0.04) 0%, transparent 50%)',
  },
  '&::after': {
    content: '""', position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
    background: theme.palette.background.default,
    clipPath: 'ellipse(55% 100% at 50% 100%)',
  },
}));

const FloatingBadge = styled(Box)(() => ({
  display: 'inline-flex', alignItems: 'center', gap: 8,
  backgroundColor: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 50, padding: '6px 18px',
  marginBottom: 24,
}));

const ArchiveCard = styled(Card)(({ theme }) => ({
  display: 'flex', borderRadius: 20, overflow: 'hidden',
  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
  background: theme.palette.mode === 'light'
    ? 'rgba(255,255,255,0.9)'
    : 'rgba(30,30,30,0.9)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: theme.palette.mode === 'light'
      ? '0 20px 50px rgba(0,0,0,0.12)'
      : '0 20px 50px rgba(0,0,0,0.45)',
    border: `1px solid ${theme.palette.primary.main}30`,
  },
}));

const GrayscaleMedia = styled(CardMedia)(() => ({
  filter: 'grayscale(40%)',
  transition: 'filter 0.4s ease',
  '&:hover': { filter: 'grayscale(0%)' },
})) as typeof CardMedia;

const GradientPlaceholder = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '2.5rem', opacity: 0.7,
}));

const MetaRow = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center', gap: theme.spacing(0.75),
  marginBottom: theme.spacing(0.5),
  '& svg': { fontSize: '0.9rem', color: theme.palette.text.secondary, flexShrink: 0 },
}));

const CompletedBadge = styled(Chip)(({ theme }) => ({
  fontWeight: 600, fontSize: '0.7rem', height: 22,
  background: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.1)',
  color: theme.palette.text.secondary,
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 800, textAlign: 'center', marginBottom: theme.spacing(1),
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
}));

const Underline = styled(Box)(({ theme }) => ({
  width: 80, height: 4, borderRadius: 2, margin: '0 auto',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  marginBottom: theme.spacing(6),
}));

// ── Component ─────────────────────────────────────────────────────────────────

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cardAnim = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const ArchivedEventsPage: React.FC = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/events/archived`)
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <FloatingBadge>
              <Inventory2 sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                Past Events
              </Typography>
            </FloatingBadge>

            <Typography variant="h2" sx={{
              color: '#fff', fontWeight: 800, mb: 2,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' }, lineHeight: 1.15,
            }}>
              Event Archive
            </Typography>
            <Typography variant="h6" sx={{
              color: 'rgba(255,255,255,0.75)', maxWidth: 540, mx: 'auto', fontWeight: 400, lineHeight: 1.6,
            }}>
              A curated history of our workshops, hackathons, and seminars. Relive the moments that built our community.
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: 8 }}>

        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Button
            component={RouterLink} to="/events"
            startIcon={<ArrowBack />}
            variant="text" color="primary"
            sx={{ textTransform: 'none', fontWeight: 600, mb: 4, pl: 0 }}
          >
            Back to Upcoming Events
          </Button>
        </motion.div>

        {loading ? (
          <LoadingSpinner message="Loading archived events…" py={10} />
        ) : events.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Box sx={{
              textAlign: 'center', py: 12, px: 4, borderRadius: 4,
              background: theme.palette.mode === 'light' ? 'rgba(63,81,181,0.04)' : 'rgba(255,255,255,0.03)',
              border: `1px dashed ${theme.palette.mode === 'light' ? 'rgba(63,81,181,0.2)' : 'rgba(255,255,255,0.1)'}`,
            }}>
              <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>📂</Typography>
              <Typography variant="h5" fontWeight={700} gutterBottom>No archived events yet</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Completed events will appear here once they wrap up.
              </Typography>
              <Button
                component={RouterLink} to="/events" variant="contained"
                sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 600, px: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}
              >
                View Upcoming Events
              </Button>
            </Box>
          </motion.div>
        ) : (
          <>
            {/* Section heading */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 40 }}>
              <SectionHeading variant="h4">{events.length} Past Events</SectionHeading>
              <Underline />
            </motion.div>

            {/* Event list */}
            <motion.div variants={container} initial="hidden" animate="show">
              <Grid container spacing={3}>
                {events.map(event => (
                  <Grid item xs={12} md={6} key={event._id}>
                    <motion.div variants={cardAnim}>
                      <ArchiveCard elevation={0}>
                        {/* Thumbnail */}
                        {event.imageUrl ? (
                          <GrayscaleMedia
                            component="img"
                            image={event.imageUrl}
                            alt={event.title}
                            sx={{ width: { xs: '100%', sm: 180 }, height: { xs: 160, sm: 'auto' }, objectFit: 'cover' }}
                          />
                        ) : (
                          <GradientPlaceholder sx={{ width: { xs: '100%', sm: 180 }, height: { xs: 120, sm: 'auto' } }}>
                            📅
                          </GradientPlaceholder>
                        )}

                        {/* Content */}
                        <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                              {event.title}
                            </Typography>
                            <CompletedBadge label="Completed" size="small" />
                          </Box>

                          <MetaRow>
                            <CalendarToday />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                          </MetaRow>
                          {event.time && (
                            <MetaRow>
                              <AccessTime />
                              <Typography variant="body2" color="text.secondary">{event.time}</Typography>
                            </MetaRow>
                          )}
                          {event.location && (
                            <MetaRow>
                              <LocationOn />
                              <Typography variant="body2" color="text.secondary">{event.location}</Typography>
                            </MetaRow>
                          )}
                          {event.description && (
                            <Typography variant="body2" color="text.secondary" sx={{
                              mt: 1, fontSize: '0.82rem', lineHeight: 1.5,
                              display: '-webkit-box', WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                              {event.description}
                            </Typography>
                          )}
                        </CardContent>
                      </ArchiveCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ArchivedEventsPage;
