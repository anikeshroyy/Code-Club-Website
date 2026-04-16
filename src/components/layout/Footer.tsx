import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  styled,
  // Divider,
  useTheme,
  Button,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
  Email,
  LocationOn,
  KeyboardArrowUp,
  // Code,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' 
    ? '#f8f9fa' 
    : '#121212',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: theme.palette.mode === 'light'
      ? 'radial-gradient(#3f51b5 0.5px, transparent 0.5px), radial-gradient(#3f51b5 0.5px, #f8f9fa 0.5px)'
      : 'radial-gradient(#6573c3 0.5px, transparent 0.5px), radial-gradient(#6573c3 0.5px, #121212 0.5px)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
    opacity: 0.03,
    zIndex: 0,
    pointerEvents: 'none',
  }
}));

const FooterContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(6, 0, 5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 0, 0),
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1.5),
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
  position: 'relative',
  paddingLeft: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1),
    fontSize: '0.85rem',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: theme.palette.primary.main,
    opacity: 0,
    transition: 'all 0.2s ease',
  },
  '&:hover': {
    color: theme.palette.primary.main,
    paddingLeft: theme.spacing(2),
    '&:before': {
      opacity: 1,
    },
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  color: theme.palette.text.secondary,
  transition: 'all 0.3s ease',
  '&:hover': {
    color: theme.palette.common.white,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1.5),
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '40px',
    height: '3px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '3px',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(1.5),
  },
  '& svg': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1.5),
    marginTop: '2px',
    fontSize: '1.2rem',
  },
}));

const ScrollTopButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(3),
  bottom: theme.spacing(10),
  minWidth: '40px',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  padding: 0,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
  zIndex: 10,
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
  },
  [theme.breakpoints.down('sm')]: {
    right: theme.spacing(2),
    bottom: theme.spacing(16),
  },
}));

const CopyrightSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
  borderTop: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.5rem',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  display: 'inline-block',
}));

const Footer: React.FC = () => {
  const theme = useTheme();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <FooterContainer component="footer">
      <FooterContent>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ [theme.breakpoints.down('sm')]: { spacing: 2 } }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <LogoText variant="h6">
                  Code Club
                </LogoText>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, maxWidth: '300px' }}>
                  A student-led organization at GEC Jamui dedicated to fostering coding culture
                  and technical innovation among students.
                </Typography>
                <Box sx={{ display: 'flex', mt: 3 }}>
                  <a href="https://www.facebook.com/code.club.gec.jamui" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <SocialButton size="small">
                      <Facebook />
                    </SocialButton>
                  </a>
                  <a href="https://x.com/codecgecjamui" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <SocialButton size="small">
                      <Twitter />
                    </SocialButton>
                  </a>
                  <a href="https://www.instagram.com/codeclubgecjamui/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <SocialButton size="small">
                      <Instagram />
                    </SocialButton>
                  </a>
                  <a href="https://www.linkedin.com/in/code-club-gec-jamui/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <SocialButton size="small">
                      <LinkedIn />
                    </SocialButton>
                  </a>
                  {/* <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <SocialButton size="small">
                      <GitHub />
                    </SocialButton>
                  </a> */}
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={2} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FooterTitle variant="h6" color="textPrimary">
                  Quick Links
                </FooterTitle>
                {/* <FooterLink to="/">Home</FooterLink> */}
                {/* <FooterLink to="/about">About Us</FooterLink> */}
                <FooterLink to="/resources">Resources</FooterLink>
                <FooterLink to="/gallery">Gallery</FooterLink>
                <FooterLink to="/join">Join Us</FooterLink>
                <FooterLink to="/announcements">Announcements</FooterLink>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FooterTitle variant="h6" color="textPrimary">
                  Official Links
                </FooterTitle>
                <FooterLink to="https://www.gecjamui.org/" target="_blank" rel="noopener noreferrer">
                  College Website
                </FooterLink>
                <FooterLink to="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </FooterLink>
                <FooterLink to="#" target="_blank" rel="noopener noreferrer">
                  ByteAcademy
                </FooterLink>
                {/* <FooterLink to="#" target="_blank" rel="noopener noreferrer">
                  Facebook
                </FooterLink> */}
                <FooterLink to="#" target="_blank" rel="noopener noreferrer">
                  Campus Map
                </FooterLink>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <FooterTitle variant="h6" color="textPrimary">
                  Contact Us
                </FooterTitle>
                
                <ContactItem>
                  <LocationOn fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    Government Engineering College, Jamui
                    <br />
                    Bihar, India
                  </Typography>
                </ContactItem>
                
                <ContactItem>
                  <Email fontSize="small" />
                  <Typography variant="body2" color="textSecondary">
                    info@codeclubgecj.com
                  </Typography>
                </ContactItem>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </FooterContent>
      
      <CopyrightSection>
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: { xs: 1, md: 2 }
              }}>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  © {new Date().getFullYear()} Code Club GEC Jamui. All rights reserved.
                </Typography>
                <Box 
                  sx={{ 
                    display: { xs: 'none', md: 'block' },
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    bgcolor: 'text.disabled'
                  }} 
                />
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                    textAlign: 'center'
                  }}
                >
                  {/* Developer Credit Section */}
                  <Box component="span" sx={{ whiteSpace: { xs: 'normal', md: 'nowrap' } }}>
                    Designed & Developed by <Box 
                      component={Link} 
                      // to="/developers" 
                      sx={{ 
                        fontWeight: 600, 
                        ml: 0.5, 
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'none'
                        }
                      }}
                    >
                      Code Club Development Team
                    </Box>
                  </Box>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </CopyrightSection>
      
      <ScrollTopButton 
        onClick={scrollToTop}
        variant="contained"
        disableElevation
      >
        <KeyboardArrowUp />
      </ScrollTopButton>
    </FooterContainer>
  );
};

export default Footer; 