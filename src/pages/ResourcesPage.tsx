import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button, Tabs, Tab, Chip, Stack } from '@mui/material';
import ResourcesHero from '../components/resources/ResourcesHero';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';


// Styled components
const ResourceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  background: theme.palette.mode === 'light' 
    ? '#ffffff' 
    : '#1e1e1e',
  boxShadow: theme.palette.mode === 'light'
    ? '0 8px 32px rgba(0, 0, 0, 0.05)'
    : '0 8px 32px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.palette.mode === 'light'
      ? '0 16px 48px rgba(0, 0, 0, 0.1)'
      : '0 16px 48px rgba(0, 0, 0, 0.3)',
  },
}));

const ResourceImage = styled(CardMedia)({
  height: 200,
  objectFit: 'cover',
});

const SectionTitle = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
  marginBottom: '48px',
  position: 'relative',
  textAlign: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px',
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: 3,
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 120,
    padding: theme.spacing(1, 2),
    [theme.breakpoints.up('sm')]: {
      minWidth: 160,
    },
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 500,
  borderRadius: '30px',
}));

// All resources data
const allResources = [
  {
    id: 1,
    title: 'Previous Year Question Papers',
    description: 'Access previous year question papers for various subjects to help you prepare for exams.',
    image: 'https://source.unsplash.com/random/600x400/?books,exam',
    category: 'academic',
    type: 'document',
    icon: <MenuBookIcon />,
  },
  {
    id: 2,
    title: 'Video Lectures on Data Structures',
    description: 'Watch comprehensive video lectures on data structures and algorithms by experienced faculty.',
    image: 'https://source.unsplash.com/random/600x400/?video,lecture',
    category: 'academic',
    type: 'video',
    icon: <PlayCircleOutlineIcon />,
  },
  {
    id: 3,
    title: 'Handwritten Notes',
    description: 'Download handwritten notes prepared by top-performing students to aid your learning.',
    image: 'https://source.unsplash.com/random/600x400/?notes,study',
    category: 'academic',
    type: 'document',
    icon: <MenuBookIcon />,
  },
  // {
  //   id: 4,
  //   title: 'Programming Fundamentals Course',
  //   description: 'A comprehensive course covering the basics of programming with practical examples.',
  //   image: 'https://source.unsplash.com/random/600x400/?programming,computer',
  //   category: 'academic',
  //   type: 'course',
  //   icon: <SchoolIcon />,
  // },
  // {
  //   id: 5,
  //   title: 'Web Development Workshop Materials',
  //   description: 'Access materials from our web development workshops including slides and code samples.',
  //   image: 'https://source.unsplash.com/random/600x400/?web,development',
  //   category: 'academic',
  //   type: 'document',
  //   icon: <MenuBookIcon />,
  // },
  // {
  //   id: 6,
  //   title: 'Database Management System Tutorials',
  //   description: 'Step-by-step tutorials on database design, SQL, and database management systems.',
  //   image: 'https://source.unsplash.com/random/600x400/?database,server',
  //   category: 'academic',
  //   type: 'video',
  //   icon: <PlayCircleOutlineIcon />,
  // },
  {
    id: 7,
    title: 'LeetCode',
    description: 'Practice coding problems and prepare for technical interviews with LeetCode.',
    image: 'https://source.unsplash.com/random/600x400/?coding,algorithm',
    category: 'platform',
    type: 'external',
    icon: <CodeIcon />,
  },
  {
    id: 8,
    title: 'HackerRank',
    description: 'Improve your coding skills by solving challenges in various domains on HackerRank.',
    image: 'https://source.unsplash.com/random/600x400/?programming,challenge',
    category: 'platform',
    type: 'external',
    icon: <CodeIcon />,
  },
  {
    id: 9,
    title: 'CodeChef',
    description: 'Participate in competitive programming contests and practice problems on CodeChef.',
    image: 'https://source.unsplash.com/random/600x400/?competition,code',
    category: 'platform',
    type: 'external',
    icon: <CodeIcon />,
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resources-tabpanel-${index}`}
      aria-labelledby={`resources-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `resources-tab-${index}`,
    'aria-controls': `resources-tabpanel-${index}`,
  };
}

const ResourcesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getFilteredResources = () => {
    if (tabValue === 0) return allResources;
    if (tabValue === 1) return allResources.filter(resource => resource.category === 'academic');
    return allResources.filter(resource => resource.category === 'platform');
  };

  const getButtonText = (type: string) => {
    switch (type) {
      case 'document': return 'Download';
      case 'video': return 'Watch Now';
      case 'course': return 'Enroll Now';
      case 'external': return 'Visit Platform';
      default: return 'Access';
    }
  };

  const getButtonVariant = (type: string) => {
    return type === 'external' ? 'contained' : 'outlined';
  };

  const getChipColor = (type: string) => {
    switch (type) {
      case 'document': return 'primary';
      case 'video': return 'secondary';
      case 'course': return 'success';
      case 'external': return 'info';
      default: return 'default';
    }
  };

  const filteredResources = getFilteredResources();

  return (
    <Box>
      <ResourcesHero />
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionTitle variant="h4" gutterBottom>
              Learning Resources
            </SectionTitle>
          </motion.div>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center', mb: 4 }}>
            <StyledTabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Resources" {...a11yProps(0)} />
              <Tab label="Academic Materials" {...a11yProps(1)} />
              <Tab label="Coding Platforms" {...a11yProps(2)} />
            </StyledTabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              {filteredResources.map((resource, index) => (
                <Grid item xs={12} sm={6} md={4} key={resource.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{ height: '100%' }}
                  >
                    <ResourceCard>
                      <ResourceImage
                        image={resource.image}
                        title={resource.title}
                      />
                      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CategoryChip 
                              label={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} 
                              color={getChipColor(resource.type) as any}
                              size="small"
                              icon={resource.icon}
                            />
                          </Stack>
                          <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                            {resource.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            {resource.description}
                          </Typography>
                        </Box>
                        <Button 
                          variant={getButtonVariant(resource.type)} 
                          color="primary"
                          startIcon={resource.type === 'document' ? <DownloadIcon /> : resource.icon}
                          sx={{ 
                            borderRadius: '30px',
                            textTransform: 'none',
                            alignSelf: 'flex-start',
                            mt: 2
                          }}
                        >
                          {getButtonText(resource.type)}
                        </Button>
                      </CardContent>
                    </ResourceCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              {filteredResources.map((resource, index) => (
                <Grid item xs={12} sm={6} md={4} key={resource.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{ height: '100%' }}
                  >
                    <ResourceCard>
                      <ResourceImage
                        image={resource.image}
                        title={resource.title}
                      />
                      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CategoryChip 
                              label={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} 
                              color={getChipColor(resource.type) as any}
                              size="small"
                              icon={resource.icon}
                            />
                          </Stack>
                          <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                            {resource.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            {resource.description}
                          </Typography>
                        </Box>
                        <Button 
                          variant={getButtonVariant(resource.type)} 
                          color="primary"
                          startIcon={resource.type === 'document' ? <DownloadIcon /> : resource.icon}
                          sx={{ 
                            borderRadius: '30px',
                            textTransform: 'none',
                            alignSelf: 'flex-start',
                            mt: 2
                          }}
                        >
                          {getButtonText(resource.type)}
                        </Button>
                      </CardContent>
                    </ResourceCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={4}>
              {filteredResources.map((resource, index) => (
                <Grid item xs={12} sm={6} md={4} key={resource.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    style={{ height: '100%' }}
                  >
                    <ResourceCard>
                      <ResourceImage
                        image={resource.image}
                        title={resource.title}
                      />
                      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CategoryChip 
                              label={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)} 
                              color={getChipColor(resource.type) as any}
                              size="small"
                              icon={resource.icon}
                            />
                          </Stack>
                          <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                            {resource.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            {resource.description}
                          </Typography>
                        </Box>
                        <Button 
                          variant={getButtonVariant(resource.type)} 
                          color="primary"
                          startIcon={resource.type === 'document' ? <DownloadIcon /> : resource.icon}
                          sx={{ 
                            borderRadius: '30px',
                            textTransform: 'none',
                            alignSelf: 'flex-start',
                            mt: 2
                          }}
                        >
                          {getButtonText(resource.type)}
                        </Button>
                      </CardContent>
                    </ResourceCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default ResourcesPage; 