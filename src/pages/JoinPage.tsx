import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button, Paper, Grid, useTheme, Alert, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import JoinHero from '../components/join/JoinHero';
import API_BASE from '../services/api';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: '16px',
  background: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(30,30,30,0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
  boxShadow: theme.palette.mode === 'light' ? '0 8px 32px rgba(0,0,0,0.05)' : '0 8px 32px rgba(0,0,0,0.2)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '24px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px', transition: 'all 0.3s ease',
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '2px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: theme.palette.primary.main },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: '16px', padding: '12px 32px', borderRadius: '30px',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: '#fff', fontWeight: 600, textTransform: 'none', fontSize: '1rem',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)', transition: 'all 0.3s ease',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' },
}));

const JoinPage: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', regNumber: '', college: '', branch: '', year: '', phone: '', interests: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <JoinHero />
      <Container maxWidth="md">
        <Box sx={{ py: 8 }}>
          {!submitted ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <FormContainer>
                <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
                  Member Registration Form
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Full Name',          name: 'name',      type: 'text',  required: true },
                      { label: 'Email Address',       name: 'email',     type: 'email', required: true },
                      { label: 'Registration Number', name: 'regNumber', type: 'text',  required: true },
                      { label: 'College Name',         name: 'college',   type: 'text',  required: true },
                      { label: 'Branch',              name: 'branch',    type: 'text',  required: true },
                      { label: 'Year of Study',       name: 'year',      type: 'text',  required: true },
                      { label: 'Phone Number',        name: 'phone',     type: 'tel',   required: true },
                    ].map(field => (
                      <Grid item xs={12} md={6} key={field.name}>
                        <StyledTextField
                          label={field.label} name={field.name} type={field.type}
                          value={(formData as any)[field.name]} onChange={handleChange}
                          fullWidth required={field.required}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <StyledTextField
                        label="Areas of Interest" name="interests" value={formData.interests}
                        onChange={handleChange} fullWidth
                        placeholder="e.g., Web Development, AI, Competitive Programming"
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <SubmitButton type="submit" variant="contained" disableElevation disabled={loading}>
                          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Registration'}
                        </SubmitButton>
                      </motion.div>
                    </Grid>
                  </Grid>
                </form>
              </FormContainer>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <FormContainer sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>🎉</Typography>
                <Typography variant="h4" component="h2" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  Registration Successful!
                </Typography>
                <Typography variant="body1" paragraph>
                  Thank you for registering with the Code Club. We have received your information and will contact you soon.
                </Typography>
                <Button variant="outlined" color="primary" onClick={() => setSubmitted(false)}
                  sx={{ mt: 2, borderRadius: '30px', textTransform: 'none' }}>
                  Register Another Member
                </Button>
              </FormContainer>
            </motion.div>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default JoinPage;