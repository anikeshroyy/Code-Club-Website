import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Chip, Tooltip, CircularProgress, Snackbar, Alert, Select, MenuItem,
  FormControl, InputLabel, Stack, useTheme, InputAdornment,
} from '@mui/material';
import { Add, Delete, Edit, CloudUpload, Link as LinkIcon, OpenInNew } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeaders, authHeadersForm } from '../../services/api';

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

const CATEGORIES = ['academic', 'platform', 'tool', 'other'];
const TYPES = ['document', 'video', 'course', 'external', 'other'];

const emptyForm = { title: '', description: '', link: '', category: 'other', type: 'external', order: '0' };

const categoryColor: Record<string, string> = {
  academic: '#667eea', platform: '#10b981', tool: '#f59e0b', other: '#64748b',
};
const typeColor: Record<string, string> = {
  document: '#3b82f6', video: '#ec4899', course: '#8b5cf6', external: '#06b6d4', other: '#6b7280',
};

const ManageResources: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchResources = () => {
    setLoading(true);
    fetch(`${API_BASE}/resources`)
      .then(r => r.json())
      .then(d => setResources(Array.isArray(d) ? d : []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  };
  useEffect(fetchResources, []);

  const openAdd = () => {
    setEditing(null); setForm(emptyForm); setThumbFile(null); setPreview(''); setDialogOpen(true);
  };
  const openEdit = (r: Resource) => {
    setEditing(r);
    setForm({ title: r.title, description: r.description, link: r.link, category: r.category, type: r.type, order: String(r.order) });
    setPreview(r.thumbnail || ''); setThumbFile(null); setDialogOpen(true);
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setThumbFile(f); setPreview(URL.createObjectURL(f));
  };
  const handleSave = async () => {
    if (!form.title.trim()) { setSnack({ open: true, msg: 'Title is required', severity: 'error' }); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (thumbFile) fd.append('thumbnail', thumbFile);
      const url = editing ? `${API_BASE}/resources/${editing._id}` : `${API_BASE}/resources`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: authHeadersForm(), body: fd });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: editing ? 'Resource updated!' : 'Resource added!', severity: 'success' });
      setDialogOpen(false); fetchResources();
    } catch (err: any) {
      setSnack({ open: true, msg: err.message, severity: 'error' });
    } finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      const res = await fetch(`${API_BASE}/resources/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: 'Resource deleted', severity: 'success' }); fetchResources();
    } catch (err: any) {
      setSnack({ open: true, msg: err.message, severity: 'error' });
    }
  };

  return (
    <AdminLayout title="Manage Resources">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Resources</Typography>
          <Typography variant="body2" color="text.secondary">{resources.length} items</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={openAdd}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
          Add Resource
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : resources.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>No resources yet</Typography>
          <Typography variant="body2" color="text.secondary">Click "Add Resource" to create the first one.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {resources.map((res, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={res._id}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                <Card elevation={0} sx={{
                  borderRadius: 3, overflow: 'hidden', height: '100%',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`,
                  bgcolor: isDark ? '#111827' : 'white',
                  '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }, transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {res.thumbnail ? (
                    <CardMedia component="img" height="140" image={res.thumbnail} alt={res.title} sx={{ objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ height: 100, background: `linear-gradient(135deg,${categoryColor[res.category] || '#64748b'}22,${categoryColor[res.category] || '#64748b'}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '2.5rem' }}>📚</Typography>
                    </Box>
                  )}
                  <CardContent sx={{ pb: 0, flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>{res.title}</Typography>
                    {res.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4, mb: 1 }}>
                        {res.description}
                      </Typography>
                    )}
                    <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                      <Chip label={res.category} size="small" sx={{ fontSize: '0.6rem', height: 18, bgcolor: (categoryColor[res.category] || '#64748b') + '22', color: categoryColor[res.category] || '#64748b', fontWeight: 600 }} />
                      <Chip label={res.type} size="small" sx={{ fontSize: '0.6rem', height: 18, bgcolor: (typeColor[res.type] || '#6b7280') + '22', color: typeColor[res.type] || '#6b7280', fontWeight: 600 }} />
                    </Stack>
                    {res.link && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.8, color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <LinkIcon sx={{ fontSize: '0.75rem' }} />
                        {res.link}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', pt: 0.5 }}>
                    {res.link && (
                      <Tooltip title="Open Link">
                        <IconButton size="small" onClick={() => window.open(res.link, '_blank')} sx={{ color: '#10b981' }}>
                          <OpenInNew fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(res)} sx={{ color: '#667eea' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(res._id)} sx={{ color: '#ef4444' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
        <DialogContent dividers>
          {/* Thumbnail upload */}
          <Box onClick={() => fileRef.current?.click()} sx={{
            border: `2px dashed ${preview ? '#667eea' : (isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1')}`,
            borderRadius: 3, p: 2.5, mb: 2.5, textAlign: 'center', cursor: 'pointer',
            background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            '&:hover': { borderColor: '#667eea', background: 'rgba(102,126,234,0.04)' }, transition: 'all 0.2s',
          }}>
            {preview ? (
              <img src={preview} alt="preview" style={{ maxHeight: 140, borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 0.5 }} />
                <Typography variant="body2" color="text.secondary">Click to upload thumbnail (optional)</Typography>
              </Box>
            )}
          </Box>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Title" size="small" required value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" size="small" multiline rows={2} value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Link / URL" size="small" value={form.link}
                onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                placeholder="https://..."
                InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon fontSize="small" /></InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select label="Category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  sx={{ borderRadius: 2 }}>
                  {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select label="Type" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  sx={{ borderRadius: 2 }}>
                  {TYPES.map(t => <MenuItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Order" size="small" type="number" value={form.order}
                onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#667eea,#764ba2)', minWidth: 100 }}>
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

export default ManageResources;
