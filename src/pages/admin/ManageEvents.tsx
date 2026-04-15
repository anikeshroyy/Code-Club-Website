import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Select, MenuItem,
  FormControl, InputLabel, Tooltip, CircularProgress, Snackbar, Alert, Switch, FormControlLabel, useTheme,
} from '@mui/material';
import { Add, Edit, Delete, Archive, Unarchive, CloudUpload } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeaders, authHeadersForm } from '../../services/api';

interface Event { _id: string; title: string; date: string; time: string; location: string; description: string; imageUrl: string; status: string; registrationLink: string; isArchived: boolean; }

const STATUSES = ['Upcoming', 'Registration Open', 'Ongoing', 'Completed'];
const emptyForm = { title: '', date: '', time: '', location: '', description: '', registrationLink: '', status: 'Upcoming' };

const ManageEvents: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchEvents = () => {
    setLoading(true);
    fetch(`${API_BASE}/events/all`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setEvents(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };
  useEffect(fetchEvents, []);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm, date: new Date().toISOString().split('T')[0] }); setImageFile(null); setPreview(''); setDialogOpen(true); };
  const openEdit = (ev: Event) => {
    setEditing(ev);
    setForm({ title: ev.title, date: new Date(ev.date).toISOString().split('T')[0], time: ev.time, location: ev.location, description: ev.description, registrationLink: ev.registrationLink, status: ev.status });
    setPreview(ev.imageUrl); setImageFile(null); setDialogOpen(true);
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; setImageFile(f); setPreview(URL.createObjectURL(f)); };
  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v as string));
      if (imageFile) fd.append('image', imageFile);
      const url = editing ? `${API_BASE}/events/${editing._id}` : `${API_BASE}/events`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: authHeadersForm(), body: fd });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: editing ? 'Event updated!' : 'Event added!', severity: 'success' });
      setDialogOpen(false); fetchEvents();
    } catch (err: any) { setSnack({ open: true, msg: err.message, severity: 'error' }); } finally { setSaving(false); }
  };
  const toggleArchive = async (ev: Event) => {
    const fd = new FormData(); fd.append('isArchived', String(!ev.isArchived));
    await fetch(`${API_BASE}/events/${ev._id}`, { method: 'PUT', headers: authHeadersForm(), body: fd });
    fetchEvents();
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE', headers: authHeadersForm() });
    fetchEvents();
  };

  const displayed = events.filter(e => e.isArchived === showArchived);
  const statusColor: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning'> = {
    'Upcoming': 'primary', 'Registration Open': 'secondary', 'Ongoing': 'success', 'Completed': 'default',
  };

  return (
    <AdminLayout title="Manage Events">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Events</Typography>
          <Typography variant="body2" color="text.secondary">{events.length} total · {events.filter(e => !e.isArchived).length} active</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel control={<Switch checked={showArchived} onChange={e => setShowArchived(e.target.checked)} />} label="Show Archived" />
          <Button startIcon={<Add />} variant="contained" onClick={openAdd}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' }}>
            New Event
          </Button>
        </Box>
      </Box>

      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> : (
        <Grid container spacing={3}>
          {displayed.map((ev, i) => (
            <Grid item xs={12} sm={6} md={4} key={ev._id}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}`, bgcolor: isDark ? '#111827' : 'white', opacity: ev.isArchived ? 0.7 : 1 }}>
                  {ev.imageUrl
                    ? <CardMedia component="img" height="160" image={ev.imageUrl} alt={ev.title} sx={{ objectFit: 'cover' }} />
                    : <Box sx={{ height: 160, background: `linear-gradient(135deg,${theme.palette.primary.dark},${theme.palette.secondary.dark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📅</Box>
                  }
                  <CardContent sx={{ pb: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1 }}>{ev.title}</Typography>
                      <Chip label={ev.status} size="small" color={statusColor[ev.status] || 'default'} sx={{ ml: 1, fontSize: '0.65rem' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      📅 {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {ev.location && ` · 📍 ${ev.location}`}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(ev)} sx={{ color: '#8b5cf6' }}><Edit fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title={ev.isArchived ? 'Unarchive' : 'Archive'}>
                      <IconButton size="small" onClick={() => toggleArchive(ev)} sx={{ color: ev.isArchived ? '#10b981' : '#f59e0b' }}>
                        {ev.isArchived ? <Unarchive fontSize="small" /> : <Archive fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(ev._id)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton></Tooltip>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
          {displayed.length === 0 && <Grid item xs={12}><Box sx={{ textAlign: 'center', py: 8 }}><Typography color="text.secondary">{showArchived ? 'No archived events.' : 'No active events. Click "New Event" to add one.'}</Typography></Box></Grid>}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Event' : 'New Event'}</DialogTitle>
        <DialogContent dividers>
          {/* Image */}
          <Box onClick={() => fileRef.current?.click()} sx={{ border: `2px dashed ${preview ? '#8b5cf6' : (isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1')}`, borderRadius: 3, p: 2.5, mb: 2.5, textAlign: 'center', cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc', '&:hover': { borderColor: '#8b5cf6' }, transition: 'all 0.2s' }}>
            {preview ? <img src={preview} alt="preview" style={{ maxHeight: 160, borderRadius: 8, objectFit: 'contain' }} /> : <Box><CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 0.5 }} /><Typography variant="body2" color="text.secondary">Click to upload event image</Typography></Box>}
          </Box>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Event Title" size="small" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Date" size="small" type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Time" size="small" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} placeholder="10:00 AM – 2:00 PM" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Location" size="small" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Description" size="small" multiline rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Registration Link" size="small" value={form.registrationLink} onChange={e => setForm(p => ({ ...p, registrationLink: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select value={form.status} label="Status" onChange={e => setForm(p => ({ ...p, status: e.target.value }))} sx={{ borderRadius: 2 }}>
                  {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', minWidth: 100 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ManageEvents;
