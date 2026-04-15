import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import API_BASE from '../../services/api';

interface Faculty {
  _id: string;
  name: string;
  position: string;
  department: string;
  imageUrl: string;
}

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  fontWeight: 600,
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 80,
    height: 4,
    borderRadius: 2,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  }
}));

const CoordinatorCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'transform 0.3s, box-shadow 0.3s',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)' },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1, display: 'flex', flexDirection: 'column',
  justifyContent: 'center', alignItems: 'center',
  padding: theme.spacing(4), textAlign: 'center',
}));

const CoordinatorAvatar = styled(Avatar)(({ theme }) => ({
  width: 120, height: 120, margin: '0 auto',
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
}));

const FacultyCoordinators: React.FC = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/faculty`)
      .then(r => r.json())
      .then(data => setFaculty(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 10, bgcolor: theme => theme.palette.mode === 'light' ? 'grey.50' : 'grey.900' }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <SectionTitle variant="h4">Guidance From Our Faculty Coordinators</SectionTitle>
        </motion.div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4} alignItems="stretch">
            {faculty.map((coordinator, index) => (
              <Grid item xs={12} md={4} key={coordinator._id} sx={{ display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  style={{ width: '100%' }}
                >
                  <CoordinatorCard>
                    <StyledCardContent>
                      <CoordinatorAvatar alt={coordinator.name} src={coordinator.imageUrl} sx={{ mb: 3 }} />
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                        {coordinator.name}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" sx={{ textAlign: 'center' }}>
                        {coordinator.position}
                      </Typography>
                    </StyledCardContent>
                  </CoordinatorCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FacultyCoordinators;