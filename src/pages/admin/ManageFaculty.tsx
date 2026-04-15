import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Card, Avatar, Typography, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Tooltip, CircularProgress, Snackbar, Alert, useTheme,
} from '@mui/material';
import { Add, Edit, Delete, PhotoCamera } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeadersForm } from '../../services/api';

interface Faculty { _id: string; name: string; position: string; department: string; imageUrl: string; order: number; }

const emptyForm = { name: '', position: '', department: '', order: '0' };

const ManageFaculty: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Faculty | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchFaculty = () => {
    setLoading(true);
    fetch(`${API_BASE}/faculty`).then(r => r.json())
      .then(d => setFaculty(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };
  useEffect(fetchFaculty, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setImagePreview(''); setDialogOpen(true); };
  const openEdit = (f: Faculty) => {
    setEditing(f); setForm({ name: f.name, position: f.position, department: f.department, order: String(f.order) });
    setImagePreview(f.imageUrl); setImageFile(null); setDialogOpen(true);
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      const url = editing ? `${API_BASE}/faculty/${editing._id}` : `${API_BASE}/faculty`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: authHeadersForm(), body: fd });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: editing ? 'Faculty updated!' : 'Faculty added!', severity: 'success' });
      setDialogOpen(false); fetchFaculty();
    } catch (err: any) { setSnack({ open: true, msg: err.message, severity: 'error' }); } finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this faculty?')) return;
    await fetch(`${API_BASE}/faculty/${id}`, { method: 'DELETE', headers: authHeadersForm() });
    fetchFaculty();
  };

  return (
    <AdminLayout title="Manage Faculty Coordinators">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Faculty Coordinators</Typography>
          <Typography variant="body2" color="text.secondary">{faculty.length} coordinators</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={openAdd}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
          Add Faculty
        </Button>
      </Box>

      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> : (
        <Grid container spacing={3}>
          {faculty.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={f._id}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card elevation={0} sx={{ p: 3, borderRadius: 3, textAlign: 'center', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, bgcolor: isDark ? '#111827' : 'white', position: 'relative', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.1)', transform: 'translateY(-3px)' }, transition: 'all 0.2s' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(f)} sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(f._id)} sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Delete fontSize="small" /></IconButton></Tooltip>
                  </Box>
                  <Avatar src={f.imageUrl} sx={{ width: 90, height: 90, mx: 'auto', mb: 2, border: '3px solid #f59e0b' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{f.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{f.position}</Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Faculty' : 'Add Faculty'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar src={imagePreview} sx={{ width: 100, height: 100, mb: 1.5 }} />
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            <Button startIcon={<PhotoCamera />} onClick={() => fileRef.current?.click()} variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>Upload Photo</Button>
          </Box>
          <Grid container spacing={2}>
            {[{ label: 'Full Name', name: 'name', required: true }, { label: 'Position', name: 'position', required: true }, { label: 'Department', name: 'department' }, { label: 'Display Order', name: 'order' }].map(fld => (
              <Grid item xs={12} key={fld.name}>
                <TextField fullWidth label={fld.label} size="small" required={fld.required}
                  value={(form as any)[fld.name]} onChange={e => setForm(p => ({ ...p, [fld.name]: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#f59e0b,#d97706)', minWidth: 100 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : editing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ManageFaculty;
