import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, IconButton, Stack, Chip, Button, Dialog, DialogTitle, DialogContent, useTheme } from '@mui/material';
import LoadingSpinner from '../common/LoadingSpinner';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import API_BASE from '../../services/api';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  batch: string;
  isPastMember: boolean;
  imageUrl: string;
  social: { linkedin: string; github: string; instagram: string };
}

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
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

const SectionDescription = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  color: theme.palette.text.secondary,
}));

const MemberCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'transform 0.3s, box-shadow 0.3s',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  textAlign: 'center',
}));

const MemberAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
}));

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [alumniOpen, setAlumniOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetch(`${API_BASE}/team`)
      .then(r => r.json())
      .then(data => setMembers(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeMembers = members.filter(m => !m.isPastMember);
  const pastMembers = members.filter(m => m.isPastMember);

  const renderMemberCard = (member: TeamMember, index: number) => (
    <Grid item xs={12} sm={6} md={4} key={member._id} sx={{ display: 'flex' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 + (index % 10) * 0.1 }}
        style={{ width: '100%' }}
      >
        <MemberCard>
          <StyledCardContent>
            <MemberAvatar alt={member.name} src={member.imageUrl} sx={{ mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', mb: 0.5 }}>
              {member.name}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {member.position}
              </Typography>
              {member.batch && (
                <Chip label={member.batch} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
              )}
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
              {member.social.linkedin && (
                <IconButton aria-label="LinkedIn" component="a" href={member.social.linkedin} target="_blank" rel="noopener noreferrer" sx={{ color: '#0077B5', p: 0.5 }}>
                  <LinkedInIcon />
                </IconButton>
              )}
              {member.social.github && (
                <IconButton aria-label="GitHub" component="a" href={member.social.github} target="_blank" rel="noopener noreferrer"
                  sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333', p: 0.5 }}>
                  <GitHubIcon />
                </IconButton>
              )}
              {member.social.instagram && (
                <IconButton aria-label="Instagram" component="a" href={member.social.instagram} target="_blank" rel="noopener noreferrer" sx={{ color: '#E1306C', p: 0.5 }}>
                  <InstagramIcon />
                </IconButton>
              )}
            </Stack>
          </StyledCardContent>
        </MemberCard>
      </motion.div>
    </Grid>
  );

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <SectionTitle variant="h4">Meet The Team</SectionTitle>
          <SectionDescription variant="body1">
            Our team consists of passionate and dedicated students who work tirelessly to organize events,
            workshops, and hackathons.
          </SectionDescription>
        </motion.div>

        {loading ? (
          <LoadingSpinner message="Loading team members…" py={6} />
        ) : (
          <Box>
            <Grid container spacing={4} alignItems="stretch">
              {activeMembers.map((member, index) => renderMemberCard(member, index))}
            </Grid>

            {pastMembers.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={() => setAlumniOpen(true)}
                  sx={{ borderRadius: '30px', textTransform: 'none', fontWeight: 600, px: 4, py: 1 }}
                >
                  View Past Members (Alumni)
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Alumni Dialog */}
      <Dialog 
        open={alumniOpen} 
        onClose={() => setAlumniOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: theme.palette.background.default } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 1, fontWeight: 800, fontSize: '2rem' }}>
          Alumni Network
        </DialogTitle>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Celebrating the contributions of our past members
        </Typography>
        <DialogContent sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
          <Grid container spacing={3}>
            {pastMembers.map((member, index) => renderMemberCard(member, index))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TeamMembers;