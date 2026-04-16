import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Divider, Chip, Paper, List, ListItem } from '@mui/material';
import LoadingSpinner from '../common/LoadingSpinner';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { CalendarToday, ArrowForward, NotificationsActive, ChevronRight } from '@mui/icons-material';
import API_BASE from '../../services/api';

interface Announcement {
  _id: string;
  title: string;
  date: string;
  description: string;
  link: string;
  badge: boolean;
}

const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)'
    : 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)',
  position: 'relative', overflow: 'hidden',
  '&::before': {
    content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800, marginBottom: theme.spacing(1),
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block',
}));

const AnnouncementContainer = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.palette.mode === 'light' ? '0 4px 20px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.2)',
  overflow: 'hidden', maxWidth: '800px', margin: '0 auto',
}));

const AnnouncementItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2, 3), display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
  borderLeft: '3px solid transparent', transition: 'all 0.2s ease',
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(2) },
  '&:hover': {
    borderLeftColor: theme.palette.primary.main,
    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
  },
}));

const DateLabel = styled(Typography)(({ theme }) => ({
  display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  '& svg': { fontSize: '0.875rem', marginRight: theme.spacing(0.5), color: theme.palette.primary.main },
}));

const AnnouncementTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600, fontSize: '1rem', lineHeight: 1.3, marginBottom: theme.spacing(0.5),
  color: theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[100],
}));

// Per-row inline "View" button
const ViewButton = styled(Button)(({ theme }) => ({
  padding: '3px 12px',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.75rem',
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(63,81,181,0.25)' : 'rgba(99,120,255,0.3)'}`,
  background: theme.palette.mode === 'light' ? 'rgba(63,81,181,0.04)' : 'rgba(99,120,255,0.06)',
  transition: 'all 0.25s ease',
  '& .MuiButton-endIcon': { transition: 'transform 0.25s ease', marginLeft: '4px' },
  '&:hover': {
    background: theme.palette.mode === 'light' ? 'rgba(63,81,181,0.1)' : 'rgba(99,120,255,0.14)',
    border: `1px solid ${theme.palette.primary.main}`,
    '& .MuiButton-endIcon': { transform: 'translateX(3px)' },
  },
}));

// Bottom "View All Announcements" CTA
const ViewAllButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: '10px 28px',
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '0.9rem',
  color: theme.palette.common.white,
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: '0 6px 20px rgba(63,81,181,0.3)',
  letterSpacing: 0.3,
  '& .MuiButton-endIcon': { transition: 'transform 0.3s ease' },
  '&:hover': {
    background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 28px rgba(63,81,181,0.4)',
    '& .MuiButton-endIcon': { transform: 'translateX(4px)' },
  },
}));

const VISIBLE_ANNOUNCEMENTS = 3;

const AnnouncementSection: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/announcements`)
      .then(r => r.json())
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visible = announcements.slice(0, VISIBLE_ANNOUNCEMENTS);
  const remaining = announcements.length - VISIBLE_ANNOUNCEMENTS;

  return (
    <SectionContainer id="announcements">
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} viewport={{ once: true, margin: '-100px' }}>
          <Box sx={{ mb: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1, px: 2.5, py: 1, borderRadius: '40px',
              background: theme => theme.palette.mode === 'light' ? 'rgba(25,118,210,0.05)' : 'rgba(25,118,210,0.1)' }}>
              <NotificationsActive color="primary" sx={{ fontSize: { sm: '1.75rem', md: '2rem' }, display: { xs: 'none', sm: 'block' } }} />
              <SectionTitle variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
                Latest Announcements
              </SectionTitle>
            </Box>
            <Typography variant="body2" color="textSecondary"
              sx={{ maxWidth: '500px', mx: 'auto', mt: 1, opacity: 0.8, display: { xs: 'none', sm: 'block' } }}>
              Stay updated with the latest events and opportunities
            </Typography>
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true, margin: '-100px' }}>
          <AnnouncementContainer elevation={0} sx={{ mx: { xs: 2, sm: 'auto' } }}>
            {loading ? (
              <LoadingSpinner message="Fetching latest announcements…" py={5} />
            ) : (
              <List disablePadding>
              {visible.map((announcement, index) => (
                <React.Fragment key={announcement._id}>
                  <AnnouncementItem>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-start' } }}>
                      <Box sx={{ width: '100%' }}>
                        <DateLabel>
                          <CalendarToday />
                          {new Date(announcement.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          {announcement.badge && <Chip label="New" size="small" color="secondary" sx={{ ml: 1, height: 16, fontSize: '0.6rem', fontWeight: 600 }} />}
                        </DateLabel>
                        <AnnouncementTitle variant="subtitle1">{announcement.title}</AnnouncementTitle>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 1 }}>{announcement.description}</Typography>
                      </Box>
                      {announcement.link && (
                        <ViewButton variant="text" endIcon={<ChevronRight fontSize="small" />} href={announcement.link} size="small"
                          sx={{ mt: { xs: 1, sm: 0 }, alignSelf: 'flex-start', ml: { xs: 0, sm: 2 }, minWidth: '80px' }}>
                          View
                        </ViewButton>
                      )}
                    </Box>
                  </AnnouncementItem>
                  {index < visible.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              </List>
            )}

              {/* View All CTA */}
              <Box sx={{ textAlign: 'center', p: { xs: 2, sm: 2.5 }, position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1.5 }}>
                {remaining > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, borderRadius: '50%',
                      bgcolor: 'primary.main', color: 'white',
                      fontSize: '0.7rem', fontWeight: 700, mr: 1,
                    }}>
                      {remaining}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                      more announcements available
                    </Typography>
                  </Box>
                )}

                {/* Pulse wrapper */}
                <ViewAllButton
                  variant="contained" disableElevation
                  endIcon={<ArrowForward fontSize="small" />}
                  href="/announcements"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  View All Announcements
                </ViewAllButton>
              </Box>
          </AnnouncementContainer>
        </motion.div>
      </Container>
    </SectionContainer>
  );
};

export default AnnouncementSection;