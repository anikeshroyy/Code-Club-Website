import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia,
  Button, Chip, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { CalendarToday, AccessTime, LocationOn, ArrowBack } from '@mui/icons-material';
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
}

const PageHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0, 6),
  textAlign: 'center',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #434343 0%, #000000 100%)'
    : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""', position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px',
    background: theme.palette.background.default,
    clipPath: 'ellipse(55% 100% at 50% 100%)',
  },
}));

const ArchivedEventCard = styled(Card)(({ theme }) => ({
  display: 'flex', borderRadius: '12px', overflow: 'hidden',
  transition: 'all 0.3s ease', opacity: 0.9,
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
  '&:hover': { transform: 'scale(1.01)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', opacity: 1 },
}));

const EventInfo = styled(Box)(({ theme }) => ({
  display: 'flex', alignItems: 'center', marginBottom: '6px',
  '& svg': { marginRight: '8px', color: theme.palette.text.secondary, fontSize: '0.9rem' },
}));

const ArchivedEventsPage: React.FC = () => {
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
      <PageHeader>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 800, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              📁 Event Archive
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', mx: 'auto' }}>
              A record of our past events, workshops, and hackathons.
            </Typography>
          </motion.div>
        </Container>
      </PageHeader>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Button component={RouterLink} to="/events" startIcon={<ArrowBack />}
            variant="text" color="primary" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Back to Upcoming Events
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={60} /></Box>
        ) : events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="text.secondary">No archived events yet.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {events.map((event, index) => (
              <Grid item xs={12} md={6} key={event._id}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.07 }}>
                  <ArchivedEventCard elevation={2}>
                    {event.imageUrl && (
                      <CardMedia
                        component="img"
                        image={event.imageUrl}
                        alt={event.title}
                        sx={{ width: { xs: '100%', sm: 180 }, height: { xs: 160, sm: 'auto' }, objectFit: 'cover', filter: 'grayscale(30%)' }}
                      />
                    )}
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{event.title}</Typography>
                        <Chip label="Completed" size="small" sx={{ ml: 1, bgcolor: 'action.selected' }} />
                      </Box>
                      <EventInfo>
                        <CalendarToday />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                      </EventInfo>
                      {event.time && (
                        <EventInfo><AccessTime /><Typography variant="body2" color="text.secondary">{event.time}</Typography></EventInfo>
                      )}
                      {event.location && (
                        <EventInfo><LocationOn /><Typography variant="body2" color="text.secondary">{event.location}</Typography></EventInfo>
                      )}
                      {event.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.82rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {event.description}
                        </Typography>
                      )}
                    </CardContent>
                  </ArchivedEventCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ArchivedEventsPage;
