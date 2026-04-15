import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton,
  Typography, IconButton, Avatar, Divider, useTheme, useMediaQuery, Tooltip,
} from '@mui/material';
import {
  Dashboard, People, School, PhotoLibrary, Campaign, Event,
  AssignmentInd, AdminPanelSettings, Menu as MenuIcon, Logout,
  ChevronLeft,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeToken } from '../../services/api';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard',         icon: <Dashboard />,         path: '/admin' },
  { label: 'Team Members',      icon: <People />,            path: '/admin/team' },
  { label: 'Faculty',           icon: <School />,            path: '/admin/faculty' },
  { label: 'Gallery',           icon: <PhotoLibrary />,      path: '/admin/gallery' },
  { label: 'Announcements',     icon: <Campaign />,          path: '/admin/announcements' },
  { label: 'Events',            icon: <Event />,             path: '/admin/events' },
  { label: 'Applications',      icon: <AssignmentInd />,     path: '/admin/applications' },
  { label: 'Admin Accounts',    icon: <AdminPanelSettings />,path: '/admin/admins' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const adminUsername = (() => {
    try {
      const token = localStorage.getItem('cc_admin_token');
      if (!token) return 'Admin';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || 'Admin';
    } catch { return 'Admin'; }
  })();

  const handleLogout = () => {
    removeToken();
    navigate('/admin/login', { replace: true });
  };

  const DrawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
          💻
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, lineHeight: 1.2 }}>Code Club</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Admin Panel</Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white', ml: 'auto' }}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Nav Items */}
      <List sx={{ flex: 1, px: 1.5, pt: 2 }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
                sx={{
                  borderRadius: '10px', py: 1.3, px: 2,
                  background: isActive ? 'linear-gradient(135deg,rgba(102,126,234,0.35),rgba(118,75,162,0.35))' : 'transparent',
                  border: isActive ? '1px solid rgba(102,126,234,0.4)' : '1px solid transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.08)' },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.55)', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'white' : 'rgba(255,255,255,0.7)' }}
                />
                {isActive && <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#a78bfa' }} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* User + Logout */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(102,126,234,0.6)', fontSize: '0.875rem', fontWeight: 700 }}>
          {adminUsername[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '0.8rem' }}>
            {adminUsername}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>Administrator</Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} size="small" sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#f87171' } }}>
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.mode === 'light' ? '#f1f5f9' : '#0a0a0f' }}>
      {/* Sidebar — desktop */}
      {!isMobile && (
        <Drawer variant="permanent" sx={{
          width: DRAWER_WIDTH, flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' },
        }}>
          {DrawerContent}
        </Drawer>
      )}

      {/* Sidebar — mobile */}
      {isMobile && (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' } }}>
          {DrawerContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <Box sx={{
          px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2,
          bgcolor: theme.palette.mode === 'light' ? 'white' : '#111827',
          borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        }}>
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.mode === 'light' ? '#1e293b' : 'white' }}>
            {title || 'Admin Panel'}
          </Typography>
        </Box>

        {/* Page body */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
