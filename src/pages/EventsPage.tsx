import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Button, Chip, CircularProgress, useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { CalendarToday, AccessTime, LocationOn, Archive } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import API_BASE from '../services/api';

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

const PageHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0, 6),
  textAlign: 'center',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""', position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
    background: theme.palette.background.default,
    clipPath: 'ellipse(55% 100% at 50% 100%)',
  },
}));

const EventCard = styled(Card)(({ theme }) => ({
  height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'light' ? '0 20px 50px rgba(0,0,0,0.12)' : '0 20px 50px rgba(0,0,0,0.4)',
  },
}));

const StatusChip = styled(Chip)(() => ({
  position: 'absolute', top: 12, right: 12, fontWeight: 600, zIndex: 2,
}));

const EventInfo = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'flex-start', marginBottom: '6px',
  '& svg': { marginRight: '8px', color: theme.palette.primary.main, fontSize: '1rem', mt: 0.2 },
}));


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
      {/* Hero */}
      <PageHeader>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              Events
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: '600px', mx: 'auto' }}>
              Discover our upcoming workshops, hackathons, and tech talks. Participate and grow with us!
            </Typography>
          </motion.div>
        </Container>
      </PageHeader>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={60} /></Box>
        ) : events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="text.secondary">No upcoming events right now.</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Check back soon or explore our archive!</Typography>
            <Button component={RouterLink} to="/events/archive" variant="contained" sx={{ mt: 3, borderRadius: '30px', textTransform: 'none' }}>
              View Archive
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }} style={{ height: '100%' }}>
                  <EventCard>
                    <Box sx={{ position: 'relative' }}>
                      {event.imageUrl
                        ? <CardMedia component="img" height="200" image={event.imageUrl} alt={event.title} sx={{ objectFit: 'cover' }} />
                        : <Box sx={{ height: 200, background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>📅</Box>
                      }
                      <StatusChip label={event.status} color={event.status === 'Registration Open' ? 'secondary' : 'primary'} size="small" />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{event.title}</Typography>
                      <EventInfo>
                        <CalendarToday sx={{ fontSize: '1rem', color: 'primary.main', mr: 1, mt: 0.2 }} />
                        <Typography variant="body2">{new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                      </EventInfo>
                      {event.time && <EventInfo><AccessTime sx={{ fontSize: '1rem', color: 'primary.main', mr: 1 }} /><Typography variant="body2">{event.time}</Typography></EventInfo>}
                      {event.location && <EventInfo><LocationOn sx={{ fontSize: '1rem', color: 'primary.main', mr: 1 }} /><Typography variant="body2">{event.location}</Typography></EventInfo>}
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2, flexGrow: 1 }}>{event.description}</Typography>
                      {event.registrationLink && (
                        <Button variant="contained" fullWidth
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ borderRadius: '30px', textTransform: 'none', fontWeight: 600, background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, color: '#fff', '&:hover': { transform: 'translateY(-1px)' } }}
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

        {/* Archive Link */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button component={RouterLink} to="/events/archive" startIcon={<Archive />}
            variant="outlined" color="primary" size="large"
            sx={{ borderRadius: '30px', textTransform: 'none', fontWeight: 600, px: 5 }}>
            View Archived Events
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default EventsPage;
