import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Button, useTheme, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(4),
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  position: 'relative',
  display: 'inline-block',
}));

const ExploreButton = styled(Button)(({ theme }) => ({
  borderRadius: '6px',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
  },
}));

const ScrollDownButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  color: theme.palette.text.primary,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '12px',
  zIndex: 10,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(255, 255, 255, 0.3)' 
      : 'rgba(0, 0, 0, 0.3)',
  },
  animation: 'bounce 2s infinite',
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateX(-50%) translateY(0)',
    },
    '40%': {
      transform: 'translateX(-50%) translateY(-10px)',
    },
    '60%': {
      transform: 'translateX(-50%) translateY(-5px)',
    },
  },
}));

const HighlightedText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
}));

const CodeBlock = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  aspectRatio: '16/10',
  backgroundColor: theme.palette.mode === 'light' 
    ? 'rgba(0, 0, 0, 0.85)' 
    : 'rgba(0, 0, 0, 0.9)',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 20px 80px rgba(0, 0, 0, 0.25)',
  fontFamily: 'monospace',
  color: '#0f0',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 2,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const CodeLine = styled(motion.div)(({ theme }) => ({
  fontSize: '13px',
  lineHeight: '1.5',
  marginBottom: '6px',
  display: 'flex',
}));

const LineNumber = styled(Box)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.3)',
  marginRight: '16px',
  userSelect: 'none',
}));

const CodeContent = styled(Box)(({ theme }) => ({
  flex: 1,
}));



// Fix the FloatingShapes component to avoid window reference during SSR
const FloatingShapes = () => {
  const [dimensions, setDimensions] = React.useState({ width: 1000, height: 800 });
  
  React.useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.3,
      }}
    >
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            background: `linear-gradient(45deg, var(--mui-palette-primary-main), var(--mui-palette-secondary-main))`,
            borderRadius: '50%',
            filter: 'blur(120px)',
            opacity: 0.15,
            zIndex: 0,
          }}
          animate={{
            x: [Math.random() * 50, Math.random() * -50, Math.random() * 50],
            y: [Math.random() * 50, Math.random() * -50, Math.random() * 50],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            width: 300 + Math.random() * 300,
            height: 300 + Math.random() * 300,
          }}
        />
      ))}
    </Box>
  );
};

// Add a coding rain effect component
const CodeRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 1000, height: 800 });
  const theme = useTheme();
  
  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const characters = '01';
    const columns = Math.floor(dimensions.width / 20); // Increased density for binary
    const drops: number[] = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    const draw = () => {
      // Add semi-transparent rectangle on top of previous frame
      ctx.fillStyle = theme.palette.mode === 'light' 
        ? 'rgba(248, 249, 250, 0.3)' 
        : 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text color based on theme
      if (theme.palette.mode === 'light') {
        // Light mode - blue with shadow
        ctx.fillStyle = 'rgba(25, 118, 210, 0.6)';
        ctx.font = '16px monospace';
        ctx.shadowColor = 'rgba(25, 118, 210, 0.4)';
        ctx.shadowBlur = 2;
      } else {
        // Dark mode - original Matrix green
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.font = '16px monospace';
        ctx.shadowBlur = 0;
      }
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random binary digit (0 or 1)
        const text = characters.charAt(Math.floor(Math.random() * 2));
        
        // x = i * fontSize, y = value of drops[i]
        ctx.fillText(text, i * 20, drops[i] * 20);
        
        // Highlight some 1s with a different color to create visual interest
        if (text === '1' && Math.random() > 0.8) {
          const originalFillStyle: string | CanvasGradient | CanvasPattern = ctx.fillStyle;
          ctx.fillStyle = theme.palette.mode === 'light' 
            ? 'rgba(25, 118, 210, 0.9)' 
            : 'rgba(50, 255, 50, 1)';
          ctx.fillText(text, i * 20, drops[i] * 20);
          ctx.fillStyle = originalFillStyle;
        }
        
        // Send drop back to top randomly after it crosses the screen
        // Add randomness to the reset to make the drops scattered
        if (drops[i] * 20 > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        
        // Increment y coordinate
        drops[i] += 0.5 + Math.random() * 0.5; // Variable speed
      }
    };
    
    const interval = setInterval(draw, 70); // Slightly faster refresh rate
    
    return () => {
      clearInterval(interval);
    };
  }, [dimensions, theme.palette.mode]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: theme.palette.mode === 'light' ? 0.4 : 0.15,
        zIndex: 0,
      }}
    />
  );
};

const codeSnippet = [
  { line: 1, content: "import React from 'react';" },
  { line: 2, content: "import { useState, useEffect } from 'react';" },
  { line: 3, content: "" },
  { line: 4, content: "// Code Club GEC Jamui - Main Component" },
  { line: 5, content: "const codeClub = () => {" },
  { line: 6, content: "  const [isLoading, setIsLoading] = useState(true);" },
  { line: 7, content: "" },
  { line: 8, content: "  useEffect(() => {" },
  { line: 9, content: "    const timer = setTimeout(() => {" },
  { line: 10, content: "      setIsLoading(false);" },
  { line: 11, content: "    }, 1500);" },
  { line: 12, content: "" },
  { line: 13, content: "    return () => {" },
  { line: 14, content: "      clearTimeout(timer);" },
  { line: 15, content: "    };" },
  { line: 16, content: "  }, []);" },
  { line: 17, content: "" },
  { line: 18, content: "  return (" },
  { line: 19, content: "    <div className=\"code-club\">" },
  { line: 20, content: "      <h2>Welcome to Code Club</h2>" },
  { line: 21, content: "      <p>Learn. Build. Innovate.</p>" },
  { line: 22, content: "    </div>" },
  { line: 23, content: "  );" },
  { line: 24, content: "};" },
  { line: 25, content: "" },
  { line: 26, content: "export default codeClub;" },
];

const HeroSection: React.FC = () => {
  const [currentLine, setCurrentLine] = useState(1);
  const theme = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine(prev => (prev < codeSnippet.length ? prev + 1 : prev));
    }, 200); // Slower typing speed

    return () => clearInterval(interval);
  }, []);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <HeroContainer>
      <FloatingShapes />
      <CodeRain />
      <Container maxWidth={false} sx={{ height: '100%' }}>
        <ContentContainer>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            height: '100%',
            [theme.breakpoints.down('md')]: {
              alignItems: 'center',
            },
          }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(25, 118, 210, 0.08)' 
                    : 'rgba(25, 118, 210, 0.15)',
                  borderRadius: '50px',
                  px: 2,
                  py: 0.5,
                  mb: 2
                }}
              >
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main',
                    mr: 1.5
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    letterSpacing: '1.5px', 
                    fontWeight: 500, 
                    fontSize: '0.7rem',
                    color: 'primary.main',
                    textTransform: 'uppercase'
                  }}
                >
                  Welcome to Code Club
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GradientText 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem', lg: '4.2rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  mb: 2.5,
                }}
              >
                Coding Community<br />
                at GEC Jamui
              </GradientText>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  maxWidth: '500px',
                  mb: 3.5,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.05rem' },
                  fontWeight: 400,
                  color: theme => theme.palette.mode === 'light' 
                    ? 'rgba(0, 0, 0, 0.7)' 
                    : 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                }}
              >
                A vibrant community where students <HighlightedText>learn</HighlightedText>, <HighlightedText>build</HighlightedText>, and <HighlightedText>innovate</HighlightedText> together through coding projects, workshops, and collaborative learning.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box sx={{ 
                display: 'flex', 
                mt: 1,
                width: { xs: '100%', sm: 'auto' },
                maxWidth: { xs: '280px', sm: '220px' },
                mx: { xs: 'auto', sm: 0 },
                [theme.breakpoints.down('md')]: {
                  justifyContent: 'center',
                },
              }}>
                <ExploreButton 
                  variant="contained" 
                  disableElevation
                  fullWidth
                  onClick={scrollToNextSection}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                    padding: { xs: '10px 16px', sm: '12px 20px', md: '14px 28px' },
                    height: { xs: '44px', sm: '48px' },
                  }}
                >
                  Explore More
                </ExploreButton>
              </Box>
            </motion.div>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            [theme.breakpoints.down('md')]: {
              display: 'none',
            },
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ width: '100%' }}
            >
              <CodeBlock>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 2,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  pb: 1
                }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#27c93f' }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>
                    codeclub.tsx
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
                  {codeSnippet.map((line, index) => {
                    if (index < currentLine) {
                      // Process the content with syntax highlighting
                      const highlightedContent = line.content
                        .replace(/import|from|const|return|export|default|useEffect/g, match => 
                          `<span style="color: #ff79c6">${match}</span>`
                        )
                        .replace(/'[^']*'/g, match => 
                          `<span style="color: #f1fa8c">${match}</span>`
                        )
                        .replace(/useState|CodeClub|setTimeout|clearTimeout/g, match => 
                          `<span style="color: #50fa7b">${match}</span>`
                        )
                        .replace(/isLoading|setIsLoading|timer/g, match => 
                          `<span style="color: #8be9fd">${match}</span>`
                        )
                        .replace(/\/\/.*$/g, match => 
                          `<span style="color: #6272a4">${match}</span>`
                        );
                        
                      return (
                        <CodeLine
                          key={line.line}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <LineNumber>{line.line}</LineNumber>
                          <CodeContent dangerouslySetInnerHTML={{ __html: highlightedContent }} />
                        </CodeLine>
                      );
                    }
                    return null;
                  })}
                </Box>
              </CodeBlock>
            </motion.div>
          </Box>
        </ContentContainer>
      </Container>

      <ScrollDownButton onClick={scrollToNextSection}>
        <KeyboardArrowDownIcon />
      </ScrollDownButton>
    </HeroContainer>
  );
};

export default HeroSection; 