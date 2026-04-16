import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, CardMedia, Button, Grid, Chip, useTheme } from '@mui/material';
import LoadingSpinner from '../common/LoadingSpinner';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { CalendarToday, AccessTime, LocationOn, Archive } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import API_BASE from '../../services/api';

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
}

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: '80px 0',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)'
    : 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '48px', textAlign: 'center', position: 'relative', fontWeight: 800, fontSize: '2.5rem',
  [theme.breakpoints.down('sm')]: { fontSize: '2rem' },
  '&::after': {
    content: '""', position: 'absolute', bottom: '-12px', left: '50%', transform: 'translateX(-50%)',
    width: '80px', height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px',
  },
}));

const EventCard = styled(Card)(({ theme }) => ({
  height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '20px', overflow: 'hidden',
  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  background: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
  border: `1.5px solid ${theme.palette.mode === 'light' ? 'rgba(63,81,181,0.18)' : 'rgba(99,120,255,0.2)'}`,
  boxShadow: theme.palette.mode === 'light' ? '0 4px 20px rgba(63,81,181,0.07)' : '0 4px 20px rgba(0,0,0,0.25)',
  padding: '8px',
  '&:hover': {
    transform: 'translateY(-10px)',
    border: `1.5px solid ${theme.palette.primary.main}`,
    boxShadow: theme.palette.mode === 'light' ? '0 20px 50px rgba(63,81,181,0.2)' : '0 20px 50px rgba(63,81,181,0.3)',
  },
}));

const EventStatusChip = styled(Chip)(() => ({
  position: 'absolute', top: 16, right: 16, fontWeight: 600, zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
}));

const EventInfo = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center', marginBottom: '8px',
  '& svg': { marginRight: '8px', color: theme.palette.primary.main, fontSize: '1rem' },
}));



const GradientFallback = styled(Box)(({ theme }) => ({
  height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
  color: theme.palette.common.white, fontSize: '3rem',
}));

const UpcomingEventSection: React.FC = () => {
  const theme = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/events/latest`)
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SectionContainer>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: '-100px' }}>
          <SectionTitle variant="h2">Upcoming Events</SectionTitle>
        </motion.div>

        {loading ? (
          <LoadingSpinner message="Loading upcoming events…" py={8} />
        ) : events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No upcoming events right now.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Check back soon or browse the archive!</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
          {events.map((event, index) => (
            <Grid item xs={12} md={4} key={event._id}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} style={{ height: '100%' }}>
                <EventCard>
                  <Box sx={{ position: 'relative' }}>
                    {event.imageUrl ? (
                      <CardMedia component="img" height="200" image={event.imageUrl} alt={event.title}
                        sx={{ objectFit: 'cover', borderRadius: '12px' }} />
                    ) : (
                      <GradientFallback sx={{ borderRadius: '12px' }}>📅</GradientFallback>
                    )}
                    <EventStatusChip label={event.status} color={event.status === 'Registration Open' ? 'secondary' : 'primary'} />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
                    <Box>
                      <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>{event.title}</Typography>
                      <EventInfo><CalendarToday /><Typography variant="body2">{new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography></EventInfo>
                      {event.time && <EventInfo><AccessTime /><Typography variant="body2">{event.time}</Typography></EventInfo>}
                      {event.location && <EventInfo><LocationOn /><Typography variant="body2">{event.location}</Typography></EventInfo>}
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>{event.description}</Typography>
                    </Box>
                    {event.registrationLink && (
                      <Button variant="contained" disableElevation
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 2, alignSelf: 'flex-start', padding: '8px 24px', borderRadius: '30px', background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: '#fff', fontWeight: 600, textTransform: 'none', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' } }}
                      >
                        Register Now
                      </Button>
                    )}
                  </CardContent>
                </EventCard>
              </motion.div>
            </Grid>
          ))}
          </Grid>
        )}

        {/* CTA Buttons */}
        <Box sx={{ textAlign: 'center', mt: 8, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 2 }}>

          {/* Primary — View All Events */}
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {/* Pulse ring */}
            <Box sx={{
              position: 'absolute', inset: -4, borderRadius: '50px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              opacity: 0.25,
              animation: 'eventPulse 2.4s ease-in-out infinite',
              '@keyframes eventPulse': {
                '0%, 100%': { transform: 'scale(1)', opacity: 0.25 },
                '50%': { transform: 'scale(1.06)', opacity: 0 },
              },
            }} />
            <Button
              component={RouterLink} to="/events"
              variant="contained" disableElevation
              endIcon={<CalendarToday sx={{ fontSize: '1rem !important' }} />}
              sx={{
                position: 'relative',
                borderRadius: '50px', textTransform: 'none', fontWeight: 700,
                px: 4, py: 1.4, fontSize: '0.95rem', letterSpacing: 0.3,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: '#fff',
                boxShadow: '0 8px 24px rgba(63,81,181,0.35)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 14px 32px rgba(63,81,181,0.45)',
                  background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              View All Events
            </Button>
          </Box>

          {/* Secondary — View Archive */}
          <Button
            component={RouterLink} to="/events/archive"
            variant="outlined"
            startIcon={<Archive />}
            sx={{
              borderRadius: '50px', textTransform: 'none', fontWeight: 600,
              px: 3.5, py: 1.3, fontSize: '0.9rem',
              borderWidth: '2px',
              borderColor: theme.palette.mode === 'light' ? 'rgba(63,81,181,0.35)' : 'rgba(255,255,255,0.2)',
              color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'rgba(255,255,255,0.85)',
              background: theme.palette.mode === 'light' ? 'rgba(63,81,181,0.04)' : 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                borderWidth: '2px',
                borderColor: theme.palette.primary.main,
                background: theme.palette.mode === 'light' ? 'rgba(63,81,181,0.08)' : 'rgba(255,255,255,0.08)',
                boxShadow: '0 8px 20px rgba(63,81,181,0.15)',
              },
            }}
          >
            View Archive
          </Button>
        </Box>
      </Container>
    </SectionContainer>
  );
};

export default UpcomingEventSection;