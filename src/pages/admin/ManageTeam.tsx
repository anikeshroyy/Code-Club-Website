import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Card, CardContent, Avatar, Typography, Button, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Tooltip, Chip, CircularProgress,
  Snackbar, Alert, Switch, FormControlLabel, useTheme,
} from '@mui/material';
import { Add, Edit, Delete, LinkedIn, GitHub, Instagram, PhotoCamera } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeadersForm } from '../../services/api';

interface Member {
  _id: string; name: string; position: string; batch: string; imageUrl: string; order: number;
  isPastMember: boolean; social: { linkedin: string; github: string; instagram: string };
}

const emptyForm = { name: '', position: '', batch: '', order: '0', isPastMember: false, linkedin: '', github: '', instagram: '' };

const ManageTeam: React.FC = () => {
  const theme = useTheme();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMembers = () => {
    setLoading(true);
    fetch(`${API_BASE}/team`)
      .then(r => r.json())
      .then(d => setMembers(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchMembers, []);

  const openAdd = () => {
    setEditing(null); setForm(emptyForm); setImageFile(null); setImagePreview(''); setDialogOpen(true);
  };
  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({ name: m.name, position: m.position, batch: m.batch || '', order: String(m.order), isPastMember: m.isPastMember || false, linkedin: m.social.linkedin, github: m.social.github, instagram: m.social.instagram });
    setImagePreview(m.imageUrl); setImageFile(null); setDialogOpen(true);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append('image', imageFile);

      const url = editing ? `${API_BASE}/team/${editing._id}` : `${API_BASE}/team`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: authHeadersForm(), body: fd });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: editing ? 'Member updated!' : 'Member added!', severity: 'success' });
      setDialogOpen(false);
      fetchMembers();
    } catch (err: any) {
      setSnack({ open: true, msg: err.message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await fetch(`${API_BASE}/team/${id}`, { method: 'DELETE', headers: authHeadersForm() });
      setSnack({ open: true, msg: 'Member deleted', severity: 'success' });
      fetchMembers();
    } catch { setSnack({ open: true, msg: 'Delete failed', severity: 'error' }); }
  };

  const isDark = theme.palette.mode === 'dark';

  return (
    <AdminLayout title="Manage Team Members">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Team Members</Typography>
          <Typography variant="body2" color="text.secondary">{members.length} members total</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={openAdd}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
          Add Member
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {members.map((m, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={m._id}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, bgcolor: isDark ? '#111827' : 'white', textAlign: 'center', p: 2, position: 'relative', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.1)', transform: 'translateY(-3px)' }, transition: 'all 0.2s' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(m)} sx={{ bgcolor: 'rgba(102,126,234,0.1)', color: '#667eea', '&:hover': { bgcolor: 'rgba(102,126,234,0.2)' } }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(m._id)} sx={{ bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' } }}><Delete fontSize="small" /></IconButton></Tooltip>
                  </Box>
                  <Avatar src={m.imageUrl} alt={m.name} sx={{ width: 80, height: 80, mx: 'auto', mb: 1.5, border: '3px solid', borderColor: '#667eea' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{m.name}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={m.position} size="small" sx={{ fontSize: '0.7rem', bgcolor: 'rgba(102,126,234,0.12)', color: '#667eea' }} />
                    {m.batch && <Chip label={m.batch} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />}
                    {m.isPastMember && <Chip label="Alumni" size="small" sx={{ fontSize: '0.7rem', bgcolor: 'rgba(245,158,11,0.12)', color: '#f59e0b' }} />}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 1.5 }}>
                    {m.social.linkedin && <IconButton size="small" href={m.social.linkedin} target="_blank" sx={{ color: '#0077B5' }}><LinkedIn fontSize="small" /></IconButton>}
                    {m.social.github   && <IconButton size="small" href={m.social.github}   target="_blank" sx={{ color: isDark ? 'white' : '#333' }}><GitHub fontSize="small" /></IconButton>}
                    {m.social.instagram && <IconButton size="small" href={m.social.instagram} target="_blank" sx={{ color: '#E1306C' }}><Instagram fontSize="small" /></IconButton>}
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Member' : 'Add New Member'}</DialogTitle>
        <DialogContent dividers>
          {/* Photo upload */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar src={imagePreview} sx={{ width: 100, height: 100, mb: 1.5 }} />
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            <Button startIcon={<PhotoCamera />} onClick={() => fileRef.current?.click()} variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>
              {imagePreview ? 'Change Photo' : 'Upload Photo'}
            </Button>
          </Box>
          <Grid container spacing={2}>
            {[
              { label: 'Full Name', name: 'name', required: true },
              { label: 'Position / Role', name: 'position', required: true },
              { label: 'Display Order', name: 'order' },
              { label: 'LinkedIn URL', name: 'linkedin' },
              { label: 'GitHub URL', name: 'github' },
              { label: 'Instagram URL', name: 'instagram' },
            ].map(f => (
              <Grid item xs={12} sm={6} key={f.name}>
                <TextField fullWidth label={f.label} size="small" required={f.required}
                  value={(form as any)[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                  variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Batch (e.g. 2022-2026)" size="small" value={form.batch} onChange={e => setForm(p => ({ ...p, batch: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch checked={form.isPastMember} onChange={e => setForm(p => ({ ...p, isPastMember: e.target.checked }))} color="primary" />} label="Past Member (Alumni)" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#667eea,#764ba2)', minWidth: 100 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : editing ? 'Update' : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ManageTeam;
