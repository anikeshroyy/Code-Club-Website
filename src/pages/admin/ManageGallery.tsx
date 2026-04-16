import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Chip, Tooltip, CircularProgress, Snackbar, Alert, Stack, useTheme,
} from '@mui/material';
import { Add, Delete, Edit, CloudUpload } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeadersForm } from '../../services/api';

interface GalleryImage { _id: string; imageUrl: string; title: string; description: string; categories: string[]; aspectRatio: string; }

const GALLERY_TAGS = ['Hackathon', 'Workshop', 'Competition', 'Tech Talk', 'Seminar', 'Cultural', 'Other'];

const emptyForm = { title: '', description: '', categories: [] as string[], aspectRatio: '3/2' };

const ManageGallery: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImages = () => { setLoading(true); fetch(`${API_BASE}/gallery`).then(r => r.json()).then(d => setImages(Array.isArray(d) ? d : [])).finally(() => setLoading(false)); };
  useEffect(fetchImages, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setPreview(''); setDialogOpen(true); };
  const openEdit = (img: GalleryImage) => {
    setEditing(img); setForm({ title: img.title, description: img.description, categories: img.categories, aspectRatio: img.aspectRatio });
    setPreview(img.imageUrl); setImageFile(null); setDialogOpen(true);
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setImageFile(f); setPreview(URL.createObjectURL(f));
  };
  const handleSave = async () => {
    if (!editing && !imageFile) { setSnack({ open: true, msg: 'Please select an image', severity: 'error' }); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      const { categories, ...rest } = form;
      Object.entries(rest).forEach(([k, v]) => fd.append(k, v));
      // Send categories as JSON string
      fd.append('categories', JSON.stringify(categories));
      if (imageFile) fd.append('image', imageFile);
      const url = editing ? `${API_BASE}/gallery/${editing._id}` : `${API_BASE}/gallery`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: authHeadersForm(), body: fd });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: editing ? 'Image updated!' : 'Image uploaded!', severity: 'success' });
      setDialogOpen(false); fetchImages();
    } catch (err: any) { setSnack({ open: true, msg: err.message, severity: 'error' }); } finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE', headers: authHeadersForm() });
    setSnack({ open: true, msg: 'Image deleted', severity: 'success' }); fetchImages();
  };

  return (
    <AdminLayout title="Manage Gallery">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Gallery</Typography>
          <Typography variant="body2" color="text.secondary">{images.length} photos</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={openAdd}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#10b981,#059669)' }}>
          Upload Photo
        </Button>
      </Box>

      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> : (
        <Grid container spacing={2}>
          {images.map((img, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={img._id}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, bgcolor: isDark ? '#111827' : 'white', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }, transition: 'all 0.2s' }}>
                  <CardMedia component="img" height="180" image={img.imageUrl} alt={img.title} sx={{ objectFit: 'cover' }} />
                  <CardContent sx={{ pb: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{img.title}</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {img.categories.map(c => <Chip key={c} label={c} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />)}
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', pt: 0.5 }}>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(img)} sx={{ color: '#667eea' }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(img._id)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton></Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Photo' : 'Upload New Photo'}</DialogTitle>
        <DialogContent dividers>
          {/* Drop zone */}
          <Box onClick={() => fileRef.current?.click()} sx={{
            border: `2px dashed ${preview ? '#10b981' : (isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1')}`,
            borderRadius: 3, p: 3, mb: 3, textAlign: 'center', cursor: 'pointer',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            '&:hover': { borderColor: '#10b981', background: 'rgba(16,185,129,0.04)' }, transition: 'all 0.2s',
          }}>
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: 180, borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">Click to select an image</Typography>
              </Box>
            )}
          </Box>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />

          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Title" size="small" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Description" size="small" multiline rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>Tags / Categories</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {GALLERY_TAGS.map(tag => {
                  const selected = form.categories.includes(tag);
                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      clickable
                      onClick={() => setForm(p => ({
                        ...p,
                        categories: selected
                          ? p.categories.filter(c => c !== tag)
                          : [...p.categories, tag],
                      }))}
                      color={selected ? 'primary' : 'default'}
                      variant={selected ? 'filled' : 'outlined'}
                      sx={{ fontWeight: selected ? 600 : 400, transition: 'all 0.2s' }}
                    />
                  );
                })}
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Aspect Ratio" size="small" value={form.aspectRatio} onChange={e => setForm(p => ({ ...p, aspectRatio: e.target.value }))} placeholder="3/2" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#10b981,#059669)', minWidth: 100 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : editing ? 'Update' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ManageGallery;
