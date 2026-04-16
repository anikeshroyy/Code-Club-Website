import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, CircularProgress, Button, useTheme,
} from '@mui/material';
import {
  People, School, PhotoLibrary, Campaign, Event, AssignmentInd, TrendingUp, LibraryBooks,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeaders } from '../../services/api';

interface Stats {
  team: number;
  faculty: number;
  gallery: number;
  resources: number;
  announcements: number;
  events: number;
  applications: number;
  pendingApplications: number;
}

interface StatCard {
  label: string;
  key: keyof Stats;
  icon: React.ReactNode;
  color: string;
  path: string;
  badge?: keyof Stats;
}

const statCards: StatCard[] = [
  { label: 'Team Members',     key: 'team',          icon: <People />,        color: '#667eea', path: '/admin/team' },
  { label: 'Faculty',          key: 'faculty',        icon: <School />,        color: '#f59e0b', path: '/admin/faculty' },
  { label: 'Gallery Photos',   key: 'gallery',        icon: <PhotoLibrary />,  color: '#10b981', path: '/admin/gallery' },
  { label: 'Resources',        key: 'resources',      icon: <LibraryBooks />,  color: '#a855f7', path: '/admin/resources' },
  { label: 'Announcements',    key: 'announcements',  icon: <Campaign />,      color: '#ef4444', path: '/admin/announcements' },
  { label: 'Events',           key: 'events',         icon: <Event />,         color: '#8b5cf6', path: '/admin/events' },
  { label: 'Applications',     key: 'applications',   icon: <AssignmentInd />, color: '#0ea5e9', path: '/admin/applications', badge: 'pendingApplications' },
];

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ team: 0, faculty: 0, gallery: 0, resources: 0, announcements: 0, events: 0, applications: 0, pendingApplications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [team, faculty, gallery, resources, announcements, events, applications] = await Promise.all([
          fetch(`${API_BASE}/team`).then(r => r.json()),
          fetch(`${API_BASE}/faculty`).then(r => r.json()),
          fetch(`${API_BASE}/gallery`).then(r => r.json()),
          fetch(`${API_BASE}/resources`).then(r => r.json()),
          fetch(`${API_BASE}/announcements/all`, { headers: authHeaders() }).then(r => r.json()),
          fetch(`${API_BASE}/events/all`, { headers: authHeaders() }).then(r => r.json()),
          fetch(`${API_BASE}/join`, { headers: authHeaders() }).then(r => r.json()),
        ]);
        const pending = Array.isArray(applications) ? applications.filter((a: any) => a.status === 'pending').length : 0;
        setStats({
          team: Array.isArray(team) ? team.length : 0,
          faculty: Array.isArray(faculty) ? faculty.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          resources: Array.isArray(resources) ? resources.length : 0,
          announcements: Array.isArray(announcements) ? announcements.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          applications: Array.isArray(applications) ? applications.length : 0,
          pendingApplications: pending,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const isDark = theme.palette.mode === 'dark';

  return (
    <AdminLayout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>Welcome back 👋</Typography>
        <Typography variant="body1" color="text.secondary">Here's what's happening with your Code Club website.</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={56} /></Box>
      ) : (
        <Grid container spacing={3}>
          {statCards.map((card, i) => (
            <Grid item xs={12} sm={6} md={4} key={card.key}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Paper
                  onClick={() => navigate(card.path)}
                  elevation={0}
                  sx={{
                    p: 3, borderRadius: 3, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                    bgcolor: isDark ? '#111827' : 'white',
                    transition: 'all 0.25s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 36px ${card.color}22`, borderColor: card.color + '55' },
                  }}
                >
                  {/* Background glow */}
                  <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: card.color + '18', pointerEvents: 'none' }} />

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>{card.label}</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: card.color, lineHeight: 1 }}>{stats[card.key]}</Typography>
                      {card.badge && stats[card.badge] > 0 && (
                        <Box sx={{ mt: 1, display: 'inline-flex', alignItems: 'center', bgcolor: '#ef444420', px: 1, py: 0.4, borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>{stats[card.badge]} pending</Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ width: 52, height: 52, borderRadius: '14px', background: card.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                      {card.icon}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 0.5 }}>
                    <TrendingUp sx={{ fontSize: '0.9rem', color: '#10b981' }} />
                    <Typography variant="caption" color="text.secondary">Click to manage</Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Quick Actions */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick Actions</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[
            { label: '+ Add Team Member',   path: '/admin/team' },
            { label: '+ Upload Photo',       path: '/admin/gallery' },
            { label: '+ New Event',          path: '/admin/events' },
            { label: '+ New Announcement',   path: '/admin/announcements' },
          ].map(qa => (
            <Button key={qa.label} variant="outlined" color="primary" onClick={() => navigate(qa.path)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
              {qa.label}
            </Button>
          ))}
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;
