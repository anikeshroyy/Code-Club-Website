import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, CardMedia, Button, Grid, Chip, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { CalendarToday, AccessTime, LocationOn } from '@mui/icons-material';
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
  height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px', overflow: 'hidden',
  transition: 'all 0.3s ease',
  background: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
  boxShadow: theme.palette.mode === 'light' ? '0 8px 32px rgba(0,0,0,0.05)' : '0 8px 32px rgba(0,0,0,0.2)',
  '&:hover': { transform: 'translateY(-10px)', boxShadow: theme.palette.mode === 'light' ? '0 16px 48px rgba(0,0,0,0.1)' : '0 16px 48px rgba(0,0,0,0.3)' },
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

  useEffect(() => {
    fetch(`${API_BASE}/events/latest`)
      .then(r => r.json())
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <SectionContainer>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true, margin: '-100px' }}>
          <SectionTitle variant="h2">Upcoming Events</SectionTitle>
        </motion.div>

        <Grid container spacing={4}>
          {events.map((event, index) => (
            <Grid item xs={12} md={4} key={event._id}>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} style={{ height: '100%' }}>
                <EventCard>
                  <Box sx={{ position: 'relative' }}>
                    {event.imageUrl ? (
                      <CardMedia component="img" height="200" image={event.imageUrl} alt={event.title}
                        sx={{ objectFit: 'cover' }} />
                    ) : (
                      <GradientFallback>📅</GradientFallback>
                    )}
                    <EventStatusChip label={event.status} color={event.status === 'Registration Open' ? 'secondary' : 'primary'} />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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

        {/* Archive Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button component={RouterLink} to="/events" variant="outlined" color="primary"
            sx={{ borderRadius: '30px', textTransform: 'none', fontWeight: 600, px: 4, py: 1.2, mr: 2 }}>
            View All Events
          </Button>
          <Button component={RouterLink} to="/events/archive" variant="text" color="primary"
            sx={{ borderRadius: '30px', textTransform: 'none', fontWeight: 500, px: 3 }}>
            📁 View Archive
          </Button>
        </Box>
      </Container>
    </SectionContainer>
  );
};

export default UpcomingEventSection;