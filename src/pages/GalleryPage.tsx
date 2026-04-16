import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Container, Grid, Chip, Stack, IconButton,
  Dialog, DialogContent, Skeleton, Button, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import GalleryHero from '../components/gallery/GalleryHero';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import FilterListIcon from '@mui/icons-material/FilterList';
import API_BASE from '../services/api';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
  categories: string[];
  aspectRatio: string;
}

// Predefined tag set — always shown regardless of DB content
const PRESET_TAGS = ['All', 'Hackathon', 'Workshop', 'Competition', 'Tech Talk', 'Seminar', 'Cultural', 'Other'];
const IMAGES_PER_PAGE = 12;

// ── Styled components ────────────────────────────────────────────────────────

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative', overflow: 'hidden', borderRadius: '16px', marginBottom: '24px',
  cursor: 'pointer',
  boxShadow: theme.palette.mode === 'light' ? '0 8px 20px rgba(0,0,0,0.1)' : '0 8px 20px rgba(0,0,0,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.palette.mode === 'light' ? '0 12px 30px rgba(0,0,0,0.15)' : '0 12px 30px rgba(0,0,0,0.4)',
    '& .overlay': { opacity: 1 },
    '& img': { filter: 'grayscale(0%)' },
    '& .zoom-icon': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  },
}));

const StyledImage = styled(LazyLoadImage)(() => ({
  width: '100%', height: 'auto', display: 'block',
  transition: 'all 0.5s ease', filter: 'grayscale(20%)',
}));

const ImageOverlay = styled(Box)(() => ({
  position: 'absolute', bottom: 0, left: 0, right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
  padding: '20px', opacity: 0, transition: 'opacity 0.3s ease',
}));

const ZoomIconOverlay = styled(Box)(() => ({
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%) scale(0.8)', opacity: 0, transition: 'all 0.3s ease',
  backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '10px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5), fontWeight: 500, transition: 'all 0.3s ease',
  padding: theme.spacing(0.5, 0),
  '&.MuiChip-filled': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  },
}));

const LightboxNavButton = styled(IconButton)(() => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0,0,0,0.5)', color: 'white',
  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
}));

const SectionTitle = styled(Typography)<{ component?: React.ElementType }>(({ theme }) => ({
  marginBottom: '48px', position: 'relative', textAlign: 'center',
  '&::after': {
    content: '""', position: 'absolute', bottom: '-12px', left: '50%',
    transform: 'translateX(-50%)', width: '80px', height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: '2px',
  },
}));

// ── Skeleton card for loading state ─────────────────────────────────────────
const ImageSkeleton: React.FC<{ heights: number[] }> = ({ heights }) => (
  <>
    {heights.map((h, i) => (
      <Box key={i} sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden' }}>
        <Skeleton variant="rectangular" width="100%" height={h} animation="wave" sx={{ borderRadius: '16px' }} />
      </Box>
    ))}
  </>
);

// ── Main Component ───────────────────────────────────────────────────────────
const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE}/gallery`)
      .then(r => r.json())
      .then(data => setImages(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Build the full tag list: preset tags + any extra tags from DB not already in preset
  const allTags = React.useMemo(() => {
    const dbTags = Array.from(new Set(images.flatMap(img => img.categories)));
    const extras = dbTags.filter(t => !PRESET_TAGS.map(p => p.toLowerCase()).includes(t.toLowerCase()));
    return [...PRESET_TAGS, ...extras];
  }, [images]);

  const filteredImages = React.useMemo(() =>
    selectedCategory === 'All'
      ? images
      : images.filter(img => img.categories.some(c => c.toLowerCase() === selectedCategory.toLowerCase())),
    [images, selectedCategory]);

  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const pagedImages = filteredImages.slice(0, currentPage * IMAGES_PER_PAGE);

  // Reset to page 1 when filter changes
  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  }, []);

  const handleLoadMore = () => {
    setPageLoading(true);
    // Simulate smooth load animation
    setTimeout(() => {
      setCurrentPage(p => p + 1);
      setPageLoading(false);
    }, 600);
  };

  const openLightbox = (index: number) => { setCurrentImage(index); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const goToPrevious = () => setCurrentImage(prev => prev === 0 ? pagedImages.length - 1 : prev - 1);
  const goToNext = () => setCurrentImage(prev => prev === pagedImages.length - 1 ? 0 : prev + 1);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, pagedImages.length]); // eslint-disable-line

  const renderColumn = (colIndex: number) => {
    const col = pagedImages.filter((_, i) => i % 3 === colIndex);
    return col.map((image, index) => {
      const globalIndex = pagedImages.indexOf(image);
      return (
        <motion.div key={image._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.07 + colIndex * 0.04 }} layout>
          <ImageContainer onClick={() => openLightbox(globalIndex)}>
            <StyledImage src={image.imageUrl} alt={image.title} effect="blur"
              style={{ aspectRatio: image.aspectRatio, objectFit: 'cover' }} />
            <ImageOverlay className="overlay">
              <Typography variant="h6" color="white" sx={{ mb: 0.5 }}>{image.title}</Typography>
              <Typography variant="body2" color="white" sx={{ mb: 1, opacity: 0.85 }}>{image.description}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {image.categories.map((cat, idx) => (
                  <Typography key={idx} variant="caption"
                    sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)', px: 1, py: 0.3, borderRadius: 1, fontSize: '0.7rem' }}>
                    {cat}
                  </Typography>
                ))}
              </Box>
            </ImageOverlay>
            <ZoomIconOverlay className="zoom-icon"><ZoomInIcon fontSize="large" /></ZoomIconOverlay>
          </ImageContainer>
        </motion.div>
      );
    });
  };

  // Skeleton heights for 3 columns of 4 items each (12 total)
  const skeletonHeights = [[180, 240, 160, 200], [220, 160, 200, 170], [160, 200, 240, 180]];

  return (
    <Box>
      <GalleryHero />
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <SectionTitle variant="h4" gutterBottom>Event Highlights</SectionTitle>
          </motion.div>

          {/* Tag Filter Chips */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 4, sm: 6 }, mt: { xs: 2, sm: 0 } }}>
            <Stack direction="row" flexWrap="wrap" justifyContent="center" sx={{ maxWidth: '100%' }}>
              {allTags.map(tag => (
                <FilterChip key={tag}
                  label={tag}
                  onClick={() => handleCategoryChange(tag)}
                  color="primary"
                  variant={selectedCategory === tag ? 'filled' : 'outlined'}
                  size="medium"
                  icon={tag === 'All' ? <FilterListIcon style={{ fontSize: '0.9rem' }} /> : undefined}
                  sx={{ m: { xs: 0.5, sm: 0.7 }, height: { xs: '32px', sm: '36px' }, my: { xs: 1, sm: 1.2 } }}
                />
              ))}
            </Stack>
          </Box>

          {/* Results count */}
          {!loading && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
              Showing <strong>{Math.min(pagedImages.length, filteredImages.length)}</strong> of <strong>{filteredImages.length}</strong> photos
              {selectedCategory !== 'All' && <> tagged <strong>{selectedCategory}</strong></>}
            </Typography>
          )}

          {/* Gallery Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {[0, 1, 2].map(col => (
                <Grid item xs={12} sm={6} md={4} key={col}>
                  <ImageSkeleton heights={skeletonHeights[col]} />
                </Grid>
              ))}
            </Grid>
          ) : filteredImages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>📷</Typography>
              <Typography variant="h6" color="text.secondary">No photos tagged "{selectedCategory}" yet.</Typography>
              <Button variant="outlined" sx={{ mt: 2, borderRadius: 4, textTransform: 'none' }}
                onClick={() => handleCategoryChange('All')}>
                View All Photos
              </Button>
            </Box>
          ) : (
            <motion.div key={selectedCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Grid container spacing={3}>
                {[0, 1, 2].map(col => (
                  <Grid item xs={12} sm={6} md={4} key={col}>{renderColumn(col)}</Grid>
                ))}
              </Grid>
            </motion.div>
          )}

          {/* Pagination — Load More */}
          {!loading && pagedImages.length < filteredImages.length && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleLoadMore}
                disabled={pageLoading}
                sx={{
                  borderRadius: 4, textTransform: 'none', fontWeight: 600, px: 5,
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  minWidth: 180,
                  '&:hover': { background: 'linear-gradient(135deg, #5a6fd6, #6a43a0)' },
                }}
              >
                {pageLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={18} color="inherit" />
                    Loading…
                  </Box>
                ) : (
                  `Load More (${filteredImages.length - pagedImages.length} remaining)`
                )}
              </Button>
            </Box>
          )}

          {/* Page indicator */}
          {!loading && totalPages > 1 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
              Page {currentPage} of {totalPages}
            </Typography>
          )}

          {/* Lightbox */}
          <Dialog open={lightboxOpen} onClose={closeLightbox} maxWidth="lg" fullWidth
            PaperProps={{ sx: { bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2, overflow: 'hidden', position: 'relative' } }}>
            <IconButton onClick={closeLightbox}
              sx={{ position: 'absolute', right: 8, top: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
              <CloseIcon />
            </IconButton>
            <DialogContent sx={{ p: 0, position: 'relative', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {pagedImages.length > 0 && (
                <>
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={pagedImages[currentImage]?.imageUrl} alt={pagedImages[currentImage]?.title}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      <LightboxNavButton onClick={goToPrevious} sx={{ left: 16 }} aria-label="previous image">
                        <ArrowBackIosNewIcon />
                      </LightboxNavButton>
                      <LightboxNavButton onClick={goToNext} sx={{ right: 16 }} aria-label="next image">
                        <ArrowForwardIosIcon />
                      </LightboxNavButton>
                    </Box>
                    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                      <Typography variant="h5" gutterBottom>{pagedImages[currentImage]?.title}</Typography>
                      <Typography variant="body1">{pagedImages[currentImage]?.description}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                        {pagedImages[currentImage]?.categories.map((cat, i) => (
                          <Chip key={i} label={cat} color="primary" size="small" sx={{ mt: 1 }} />
                        ))}
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {currentImage + 1} / {pagedImages.length}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </DialogContent>
          </Dialog>
        </Box>
      </Container>
    </Box>
  );
};

export default GalleryPage;