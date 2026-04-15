import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Alert, CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API_BASE, { setToken, isLoggedIn } from '../../services/api';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn()) navigate('/admin', { replace: true });
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setToken(data.token);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <Box sx={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(102,126,234,0.15),transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(118,75,162,0.15),transparent 70%)', pointerEvents: 'none' }} />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Paper elevation={0} sx={{
          width: { xs: '90vw', sm: 420 },
          p: 5, borderRadius: 4,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '18px',
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(102,126,234,0.4)',
            }}>
              <LockOutlined sx={{ color: 'white', fontSize: 32 }} />
            </Box>
          </Box>

          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 800, color: 'white', mb: 0.5 }}>
            Admin Login
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', mb: 3 }}>
            Code Club Management Panel
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Username" name="username" value={form.username}
              onChange={handleChange} required autoFocus
              variant="outlined"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.07)', color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
              inputProps={{ style: { color: 'white' } }}
            />
            <TextField
              fullWidth label="Password" name="password" value={form.password}
              onChange={handleChange} required
              type={showPw ? 'text' : 'password'}
              variant="outlined"
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'rgba(255,255,255,0.07)', color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' } }}
              inputProps={{ style: { color: 'white' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(p => !p)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button fullWidth type="submit" variant="contained" disabled={loading} size="large"
              sx={{
                borderRadius: 2, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '1rem',
                background: 'linear-gradient(135deg,#667eea,#764ba2)',
                boxShadow: '0 8px 24px rgba(102,126,234,0.35)',
                '&:hover': { background: 'linear-gradient(135deg,#5a6fd1,#6a3d9a)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s',
              }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AdminLogin;
