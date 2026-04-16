import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, List, ListItem, Divider, Chip, Button, useTheme } from '@mui/material';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { styled } from '@mui/material/styles';
import { CalendarToday, ChevronRight } from '@mui/icons-material';
import { motion } from 'framer-motion';
import API_BASE from '../services/api';

interface Announcement {
  _id: string;
  title: string;
  date: string;
  description: string;
  link: string;
  badge: boolean;
}

const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 0, 8),
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)'
    : 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)',
  minHeight: 'calc(100vh - 64px)',
  position: 'relative',
  '&::before': {
    content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4), textAlign: 'center', position: 'relative', zIndex: 1,
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800, marginBottom: theme.spacing(1),
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block',
  fontSize: '2.5rem', [theme.breakpoints.down('sm')]: { fontSize: '1.75rem' },
}));

const AnnouncementContainer = styled(Paper)(({ theme }) => ({
  background: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.palette.mode === 'light' ? '0 4px 20px rgba(0,0,0,0.05)' : '0 4px 20px rgba(0,0,0,0.2)',
  overflow: 'hidden', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1,
  '&:hover': { transform: 'translateY(-4px)' },
  transition: 'transform 0.3s ease',
}));

const AnnouncementItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(3), display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
  borderLeft: '3px solid transparent', transition: 'all 0.2s ease',
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
  fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.3, marginBottom: theme.spacing(1),
  color: theme.palette.mode === 'light' ? theme.palette.grey[900] : theme.palette.grey[100],
}));

const ViewButton = styled(Button)(({ theme }) => ({
  padding: '6px 16px', borderRadius: '20px', textTransform: 'none', fontWeight: 500, fontSize: '0.75rem',
  color: theme.palette.common.white,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  '&:hover': { background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})` },
}));

const AnnouncementsPage: React.FC = () => {
  const theme = useTheme();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/announcements`)
      .then(r => r.json())
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const newCount = announcements.filter(a => a.badge).length;

  return (
    <PageContainer>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <PageHeader sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
            <PageTitle variant="h3">All Announcements</PageTitle>
            <Typography variant="body1" color="textSecondary" sx={{ maxWidth: '600px', mx: 'auto', opacity: 0.8, mb: 1 }}>
              Stay updated with all events and opportunities
            </Typography>
            <Box sx={{ width: '60px', height: '4px', background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, mx: 'auto', mt: 2, borderRadius: '2px' }} />
          </PageHeader>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <AnnouncementContainer elevation={0} sx={{ mx: { xs: 0, sm: 'auto' }, borderRadius: { xs: 1, sm: 2 }, mt: { xs: 3, sm: 4 } }}>
            <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{announcements.length} Announcements</Typography>
              {newCount > 0 && <Chip label={`${newCount} New`} color="secondary" size="small" sx={{ fontWeight: 500 }} />}
            </Box>

            {loading ? (
              <LoadingSpinner message="Loading all announcements…" py={6} />
            ) : (
              <List disablePadding>
                {announcements.map((announcement, index) => (
                  <motion.div key={announcement._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 * index }}>
                    <AnnouncementItem>
                      <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-start' }, gap: { xs: 1, sm: 2 } }}>
                        <Box sx={{ width: '100%' }}>
                          <DateLabel>
                            <CalendarToday />
                            {new Date(announcement.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                            {announcement.badge && <Chip label="New" size="small" color="secondary" sx={{ ml: 1, height: 16, fontSize: '0.6rem', fontWeight: 600, px: 0.5 }} />}
                          </DateLabel>
                          <AnnouncementTitle variant="subtitle1">{announcement.title}</AnnouncementTitle>
                          <Typography variant="body2" color="text.secondary">{announcement.description}</Typography>
                        </Box>
                        {announcement.link && (
                          <ViewButton variant="contained" endIcon={<ChevronRight fontSize="small" />} href={announcement.link} size="small" sx={{ mt: { xs: 1, sm: 0 }, minWidth: '120px', whiteSpace: 'nowrap', width: { xs: '100%', sm: 'auto' } }}>
                            View Details
                          </ViewButton>
                        )}
                      </Box>
                    </AnnouncementItem>
                    {index < announcements.length - 1 && <Divider sx={{ opacity: 0.6, mx: { xs: 0, sm: 2 } }} />}
                  </motion.div>
                ))}
              </List>
            )}

            <Box sx={{ p: { xs: 3, sm: 4 }, borderTop: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`, textAlign: 'center' }}>
              <Button variant="contained" color="primary" href="/"
                sx={{ borderRadius: '20px', textTransform: 'none', fontWeight: 600, px: 4, py: 1, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` }}>
                Back to Home
              </Button>
            </Box>
          </AnnouncementContainer>
        </motion.div>

        <Box sx={{ mt: 4, textAlign: 'center', opacity: 0.7 }}>
          <Typography variant="caption" color="text.secondary">Last updated: {new Date().toLocaleDateString()}</Typography>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default AnnouncementsPage;