import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  useTheme,
  Avatar,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Menu as MenuIcon,
  KeyboardArrowDown,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme as useCustomTheme } from '../../theme/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface NavLink {
  name: string;
  path: string;
  isNew?: boolean;
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Resources', path: '/resources' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Join', path: '/join' },
];

const NavbarContainer = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.8)'
    : 'rgba(18, 18, 18, 0.8)',
  transition: 'all 0.3s ease',
  borderBottom: theme.palette.mode === 'light'
    ? '1px solid rgba(0, 0, 0, 0.05)'
    : '1px solid rgba(255, 255, 255, 0.05)',
}));

const NavLinkButton = styled(Button)<{ component?: React.ElementType }>(({ theme }) => ({
  marginLeft: theme.spacing(1),
  padding: theme.spacing(1, 2),
  color: theme.palette.text.primary,
  fontWeight: 500,
  borderRadius: '8px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(0, 0, 0, 0.04)' 
      : 'rgba(255, 255, 255, 0.04)',
    '&::before': {
      width: '80%',
    },
  },
  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(0, 0, 0, 0.04)' 
      : 'rgba(255, 255, 255, 0.04)',
    '&::before': {
      width: '80%',
    },
  },
}));


const MobileNavItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  margin: theme.spacing(0.5, 1),
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.selected': {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(0, 0, 0, 0.04)' 
      : 'rgba(255, 255, 255, 0.04)',
    color: theme.palette.primary.main,
  },
}));


const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  useCustomTheme();

  // Pages whose hero is dark — nav should be white when transparent
  const darkHeroRoutes = ['/events', '/events/archive', '/social'];
  const navOnDark = !scrolled && darkHeroRoutes.includes(location.pathname);

  // Computed nav text color: white on dark heroes (transparent navbar), else theme default
  const navTextColor = navOnDark ? '#fff' : theme.palette.text.primary;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <NavbarContainer 
      position="fixed" 
      elevation={scrolled ? 0 : 0}
      sx={{
        backgroundColor: scrolled 
          ? (theme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(18, 18, 18, 0.9)')
          : 'transparent',
        boxShadow: scrolled 
          ? (theme.palette.mode === 'light'
              ? '0 4px 20px rgba(0, 0, 0, 0.05)'
              : '0 4px 20px rgba(0, 0, 0, 0.3)')
          : 'none',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          disableGutters 
          sx={{ 
            height: scrolled ? 64 : 80, 
            transition: 'height 0.3s ease' 
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flexGrow: 1 }}
          >
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              <Box
                sx={{
                  height: scrolled ? 38 : 46,
                  width: scrolled ? 38 : 46,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  // Thin border ring
                  border: navOnDark
                    ? '1.5px solid rgba(255,255,255,0.55)'
                    : `1.5px solid rgba(63,81,181,0.3)`,
                  // 3px inner gap between border and image
                  padding: '3px',
                  background: navOnDark ? 'rgba(255,255,255,0.88)' : 'transparent',
                  boxShadow: navOnDark ? '0 2px 10px rgba(0,0,0,0.2)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {/* Inner img clipped to circle */}
                <Box
                  component="img"
                  src="/logo192x192.png"
                  alt="Code Club Logo"
                  sx={{
                    height: '100%', width: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    display: 'block',
                  }}
                />
              </Box>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ color: navTextColor, transition: 'color 0.3s ease' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link 
                  to={link.path}
                  style={{ textDecoration: 'none', position: 'relative' }}
                >
                  <NavLinkButton
                    className={isActive(link.path) ? 'active' : ''}
                    sx={{ color: navTextColor, transition: 'color 0.3s ease' }}
                  >
                    {link.name}
                  </NavLinkButton>
                </Link>
              </motion.div>
            ))}
            
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <ThemeToggle sx={{ mr: 1, color: navTextColor, transition: 'color 0.3s ease' }} />
              <Tooltip title="Admin Login">
                <IconButton component={Link} to="/admin/login" sx={{ ml: 1, p: 0.5 }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      border: `2px solid ${navOnDark ? 'rgba(255,255,255,0.7)' : theme.palette.primary.main}`,
                      transition: 'border-color 0.3s ease',
                    }}
                    alt="Admin"
                    src="/images/avatar-placeholder.jpg"
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: theme.palette.background.default,
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            boxShadow: theme.palette.mode === 'light'
              ? '0 0 40px rgba(0, 0, 0, 0.1)'
              : '0 0 40px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {/* @ts-ignore */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                  <Box sx={{
                    height: 40, width: 40, borderRadius: '50%',
                    border: `1.5px solid rgba(63,81,181,0.3)`,
                    padding: '3px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Box
                      component="img"
                      src="/logo192x192.png"
                      alt="Code Club Logo"
                      sx={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
                    />
                  </Box>
                </Link>
                <IconButton 
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light' 
                        ? 'rgba(0, 0, 0, 0.04)' 
                        : 'rgba(255, 255, 255, 0.04)',
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ px: 2, pb: 3 }}>
                <Box 
                  component={Link}
                  to="/admin/login"
                  onClick={handleDrawerToggle}
                  sx={{ 
                  p: 2, 
                  borderRadius: '12px', 
                  bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  textDecoration: 'none',
                  color: 'inherit'
                }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40,
                      border: `2px solid ${theme.palette.primary.main}`,
                      mr: 2
                    }}
                    alt="Admin"
                    src="/images/avatar-placeholder.jpg"
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Admin Panel</Typography>
                    <Typography variant="caption" color="textSecondary">Manage Website</Typography>
                  </Box>
                </Box>
              </Box>
              
              <List sx={{ px: 2 }}>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                      onClick={handleDrawerToggle}
                    >
                      <MobileNavItem
                        className={isActive(link.path) ? 'selected' : ''}
                      >
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {link.name}
                            </Box>
                          } 
                        />
                        <KeyboardArrowDown 
                          sx={{ 
                            fontSize: 18, 
                            transform: isActive(link.path) ? 'rotate(-180deg)' : 'none',
                            transition: 'transform 0.3s ease',
                            opacity: 0.6
                          }} 
                        />
                      </MobileNavItem>
                    </Link>
                  </motion.div>
                ))}
              </List>
              
              <Box sx={{ p: 3, mt: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 2,
                  borderRadius: '12px',
                  bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                }}>
                  <Typography variant="subtitle2">
                    {theme.palette.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </Typography>
                  <ThemeToggle />
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                  © 2024 Code Club GEC Jamui
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Version 1.0.0
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Drawer>
    </NavbarContainer>
  );
};

export default Navbar; 