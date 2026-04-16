import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Button, Chip, useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  CalendarToday, AccessTime, LocationOn, Archive, OpenInNew, EventNote,
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
  registrationLink: string;
  isArchived: boolean;
}

// ── Styled Components ─────────────────────────────────────────────────────────

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(14, 0, 10),
  textAlign: 'center',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  overflow: 'hidden',
  '&::before': {
    content: '""', position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
  },
  '&::after': {
    content: '""', position: 'absolute', bottom: 0, left: 0, right: 0, height: 70,
    background: theme.palette.background.default,
    clipPath: 'ellipse(55% 100% at 50% 100%)',
  },
}));

const FloatingBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex', alignItems: 'center', gap: theme.spacing(1),
  backgroundColor: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 50, padding: theme.spacing(0.5, 2),
  marginBottom: theme.spacing(3),
}));

const EventCard = styled(Card)(({ theme }) => ({
  height: '100%', display: 'flex', flexDirection: 'column',
  borderRadius: 20, overflow: 'hidden',
  border: `1.5px solid ${theme.palette.mode === 'light' ? 'rgba(63,81,181,0.2)' : 'rgba(99,120,255,0.22)'}`,
  background: theme.palette.mode === 'light'
    ? 'rgba(255,255,255,0.95)'
    : 'rgba(30,30,30,0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'light'
    ? '0 4px 20px rgba(63,81,181,0.08)'
    : '0 4px 20px rgba(0,0,0,0.3)',
  padding: '8px',
  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    border: `1.5px solid ${theme.palette.primary.main}`,
    boxShadow: theme.palette.mode === 'light'
      ? '0 24px 60px rgba(63,81,181,0.22)'
      : '0 24px 60px rgba(63,81,181,0.3)',
  },
}));

const ImageWrap = styled(Box)(() => ({
  position: 'relative', overflow: 'hidden', borderRadius: '14px',
  '&:hover img': { transform: 'scale(1.05)' },
  '& img': { transition: 'transform 0.5s ease' },
}));

const StatusBadge = styled(Chip)(() => ({
  position: 'absolute', top: 12, right: 12, fontWeight: 700,
  fontSize: '0.7rem', letterSpacing: 0.5, zIndex: 2,
  backdropFilter: 'blur(6px)',
}));

const GradientPlaceholder = styled(Box)(({ theme }) => ({
  height: 200, borderRadius: '14px',
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '3.5rem',
}));

const MetaRow = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center', gap: theme.spacing(0.75),
  marginBottom: theme.spacing(0.75),
  '& svg': { fontSize: '0.95rem', color: theme.palette.primary.main, flexShrink: 0 },
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

const RegisterBtn = styled(Button)<{ href?: string; target?: string; rel?: string }>(({ theme }) => ({
  marginTop: 'auto', borderRadius: 50, fontWeight: 600,
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: '#fff', textTransform: 'none',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(63,81,181,0.35)' },
}));

const ArchiveBanner = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(5),
  borderRadius: 24,
  textAlign: 'center',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)'
    : 'linear-gradient(135deg, rgba(63,81,181,0.12) 0%, rgba(245,0,87,0.08) 100%)',
  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(63,81,181,0.15)' : 'rgba(255,255,255,0.06)'}`,
}));

// ── Component ─────────────────────────────────────────────────────────────────

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const cardAnim = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const EventsPage: React.FC = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/events`)
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
              <EventNote sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                What's Happening
              </Typography>
            </FloatingBadge>

            <Typography variant="h2" sx={{
              color: '#fff', fontWeight: 800, mb: 2,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' }, lineHeight: 1.15,
            }}>
              Upcoming Events
            </Typography>
            <Typography variant="h6" sx={{
              color: 'rgba(255,255,255,0.8)', maxWidth: 560, mx: 'auto', fontWeight: 400, lineHeight: 1.6,
            }}>
              Discover workshops, hackathons, and tech talks. Level up your skills and grow with the community.
            </Typography>
          </motion.div>
        </Container>
      </HeroSection>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: 8 }}>

        {loading ? (
          <LoadingSpinner message="Loading events…" py={10} />
        ) : events.length === 0 ? (
          /* ── Empty state ── */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Box sx={{
              textAlign: 'center', py: 12, px: 4,
              borderRadius: 4,
              background: theme.palette.mode === 'light' ? 'rgba(63,81,181,0.04)' : 'rgba(255,255,255,0.03)',
              border: `1px dashed ${theme.palette.mode === 'light' ? 'rgba(63,81,181,0.2)' : 'rgba(255,255,255,0.1)'}`,
            }}>
              <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>🗓️</Typography>
              <Typography variant="h5" fontWeight={700} gutterBottom>No upcoming events right now</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We're planning something exciting. Check back soon or browse our past events!
              </Typography>
              <Button
                component={RouterLink} to="/events/archive"
                variant="contained" startIcon={<Archive />}
                sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 600, px: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}
              >
                Browse Event Archive
              </Button>
            </Box>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 40 }}>
              <SectionHeading variant="h4">All Events</SectionHeading>
              <Underline />
            </motion.div>

            {/* ── Event cards grid ── */}
            <motion.div variants={container} initial="hidden" animate="show">
              <Grid container spacing={4}>
                {events.map(event => (
                  <Grid item xs={12} sm={6} md={4} key={event._id}>
                    <motion.div variants={cardAnim} style={{ height: '100%' }}>
                      <EventCard>
                        <ImageWrap>
                          {event.imageUrl
                            ? <CardMedia component="img" height={200} image={event.imageUrl} alt={event.title} />
                            : <GradientPlaceholder>📅</GradientPlaceholder>
                          }
                          <StatusBadge
                            label={event.status}
                            size="small"
                            color={event.status === 'Registration Open' ? 'secondary' : 'primary'}
                          />
                        </ImageWrap>

                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5, p: 3 }}>
                          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, lineHeight: 1.3 }}>
                            {event.title}
                          </Typography>

                          <MetaRow>
                            <CalendarToday />
                            <Typography variant="body2">
                              {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                          </MetaRow>
                          {event.time && (
                            <MetaRow>
                              <AccessTime />
                              <Typography variant="body2">{event.time}</Typography>
                            </MetaRow>
                          )}
                          {event.location && (
                            <MetaRow>
                              <LocationOn />
                              <Typography variant="body2">{event.location}</Typography>
                            </MetaRow>
                          )}

                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2, flexGrow: 1, lineHeight: 1.6 }}>
                            {event.description}
                          </Typography>

                          {event.registrationLink && (
                            <RegisterBtn
                              variant="contained" fullWidth disableElevation
                              href={event.registrationLink}
                              target="_blank" rel="noopener noreferrer"
                              endIcon={<OpenInNew sx={{ fontSize: '0.9rem' }} />}
                            >
                              Register Now
                            </RegisterBtn>
                          )}
                        </CardContent>
                      </EventCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </>
        )}

        {/* ── Archive Banner ─────────────────────────────────────────────── */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <ArchiveBanner>
              <Archive sx={{ fontSize: '2.5rem', color: 'primary.main', mb: 1 }} />
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Looking for past events?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 480, mx: 'auto' }}>
                Browse our archive of completed workshops, hackathons, and seminars.
              </Typography>
              <Button
                component={RouterLink} to="/events/archive"
                variant="outlined" color="primary" size="large"
                startIcon={<Archive />}
                sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 600, px: 5, py: 1.2 }}
              >
                View Event Archive
              </Button>
            </ArchiveBanner>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default EventsPage;
