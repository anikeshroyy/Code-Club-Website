import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, CardMedia,
  Button, Tabs, Tab, Chip, Stack, Skeleton,
} from '@mui/material';
import ResourcesHero from '../components/resources/ResourcesHero';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CodeIcon from '@mui/icons-material/Code';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import API_BASE from '../services/api';

interface Resource {
  _id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  type: string;
  thumbnail: string;
  order: number;
}

// ── Styled components ────────────────────────────────────────────────────────

const ResourceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  background: theme.palette.mode === 'light' ? '#ffffff' : '#1e1e1e',
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

// ── Helpers ──────────────────────────────────────────────────────────────────

const getIcon = (type: string) => {
  switch (type) {
    case 'document': return <MenuBookIcon />;
    case 'video':    return <PlayCircleOutlineIcon />;
    case 'course':   return <SchoolIcon />;
    case 'external': return <CodeIcon />;
    case 'tool':     return <BuildIcon />;
    default:         return <OpenInNewIcon />;
  }
};

const getButtonText = (type: string) => {
  switch (type) {
    case 'document': return 'Download';
    case 'video':    return 'Watch Now';
    case 'course':   return 'Enroll Now';
    case 'external': return 'Visit Platform';
    default:         return 'Open';
  }
};

const getChipColor = (type: string) => {
  switch (type) {
    case 'document': return 'primary';
    case 'video':    return 'secondary';
    case 'course':   return 'success';
    case 'external': return 'info';
    default:         return 'default';
  }
};

// ── Tab panel ────────────────────────────────────────────────────────────────

interface TabPanelProps { children?: React.ReactNode; index: number; value: number; }

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}
      id={`resources-tabpanel-${index}`} aria-labelledby={`resources-tab-${index}`} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return { id: `resources-tab-${index}`, 'aria-controls': `resources-tabpanel-${index}` };
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────

const ResourceSkeleton: React.FC = () => (
  <Card elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', height: '100%' }}>
    <Skeleton variant="rectangular" height={200} animation="wave" />
    <CardContent>
      <Skeleton variant="rounded" width={80} height={24} sx={{ mb: 1.5, borderRadius: 4 }} animation="wave" />
      <Skeleton variant="text" height={32} animation="wave" />
      <Skeleton variant="text" height={20} animation="wave" />
      <Skeleton variant="text" height={20} width="70%" animation="wave" />
      <Skeleton variant="rounded" width={120} height={36} sx={{ mt: 2, borderRadius: 4 }} animation="wave" />
    </CardContent>
  </Card>
);

// ── Default placeholder thumbnail per category ────────────────────────────────

const DEFAULT_THUMB: Record<string, string> = {
  academic: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
  platform: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
  tool:     'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  other:    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
};

// ── ResourceCard render helper ────────────────────────────────────────────────

const ResourceCardItem: React.FC<{ resource: Resource; index: number }> = ({ resource, index }) => {
  const thumb = resource.thumbnail || DEFAULT_THUMB[resource.category] || DEFAULT_THUMB.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      style={{ height: '100%' }}
    >
      <ResourceCard>
        <CardMedia component="img" image={thumb} title={resource.title} sx={{ height: 200, objectFit: 'cover' }} />
        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <CategoryChip
                label={resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                color={getChipColor(resource.type) as any}
                size="small"
                icon={getIcon(resource.type)}
              />
            </Stack>
            <Typography variant="h5" component="h3" sx={{ mb: 1.5, fontWeight: 600 }}>
              {resource.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {resource.description}
            </Typography>
          </Box>
          {resource.link ? (
            <Button
              variant={resource.type === 'external' ? 'contained' : 'outlined'}
              color="primary"
              startIcon={resource.type === 'document' ? <DownloadIcon /> : getIcon(resource.type)}
              component="a"
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: '30px', textTransform: 'none', alignSelf: 'flex-start', mt: 2 }}
            >
              {getButtonText(resource.type)}
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              startIcon={getIcon(resource.type)}
              disabled
              sx={{ borderRadius: '30px', textTransform: 'none', alignSelf: 'flex-start', mt: 2 }}
            >
              {getButtonText(resource.type)}
            </Button>
          )}
        </CardContent>
      </ResourceCard>
    </motion.div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────

const ResourcesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/resources`)
      .then(r => r.json())
      .then(data => setResources(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getFiltered = () => {
    if (tabValue === 0) return resources;
    if (tabValue === 1) return resources.filter(r => r.category === 'academic');
    if (tabValue === 2) return resources.filter(r => r.category === 'platform');
    if (tabValue === 3) return resources.filter(r => r.category === 'tool');
    return resources.filter(r => r.category === 'other');
  };

  const filteredResources = getFiltered();

  const renderCards = (list: Resource[]) => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <ResourceSkeleton />
        </Grid>
      ));
    }
    if (list.length === 0) {
      return (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h2" sx={{ mb: 2 }}>📚</Typography>
            <Typography variant="h6" color="text.secondary">No resources in this category yet.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Check back later or explore other categories.
            </Typography>
          </Box>
        </Grid>
      );
    }
    return list.map((resource, index) => (
      <Grid item xs={12} sm={6} md={4} key={resource._id}>
        <ResourceCardItem resource={resource} index={index} />
      </Grid>
    ));
  };

  return (
    <Box>
      <ResourcesHero />
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <SectionTitle variant="h4" gutterBottom>Learning Resources</SectionTitle>
          </motion.div>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center', mb: 4 }}>
            <StyledTabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              centered
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Resources" {...a11yProps(0)} />
              <Tab label="Academic" {...a11yProps(1)} />
              <Tab label="Platforms" {...a11yProps(2)} />
              <Tab label="Tools" {...a11yProps(3)} />
              <Tab label="Other" {...a11yProps(4)} />
            </StyledTabs>
          </Box>

          {[0, 1, 2, 3, 4].map(idx => (
            <TabPanel key={idx} value={tabValue} index={idx}>
              <Grid container spacing={4}>
                {renderCards(filteredResources)}
              </Grid>
            </TabPanel>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ResourcesPage;