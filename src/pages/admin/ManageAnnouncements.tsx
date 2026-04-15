import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, Switch, FormControlLabel, Tooltip, CircularProgress, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeaders } from '../../services/api';

interface Announcement { _id: string; title: string; date: string; description: string; link: string; badge: boolean; isActive: boolean; }

const emptyForm = { title: '', date: '', description: '', link: '', badge: true };

const ManageAnnouncements: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });

  const fetchAll = () => {
    setLoading(true);
    fetch(`${API_BASE}/announcements/all`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setAnnouncements(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };
  useEffect(fetchAll, []);

  const openAdd = () => {
    setEditing(null); setForm({ ...emptyForm, date: new Date().toISOString().split('T')[0] }); setDialogOpen(true);
  };
  const openEdit = (a: Announcement) => {
    setEditing(a); setForm({ title: a.title, date: new Date(a.date).toISOString().split('T')[0], description: a.description, link: a.link, badge: a.badge });
    setDialogOpen(true);
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editing ? `${API_BASE}/announcements/${editing._id}` : `${API_BASE}/announcements`;
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: editing ? 'Updated!' : 'Added!', severity: 'success' });
      setDialogOpen(false); fetchAll();
    } catch (err: any) { setSnack({ open: true, msg: err.message, severity: 'error' }); } finally { setSaving(false); }
  };
  const toggleActive = async (a: Announcement) => {
    await fetch(`${API_BASE}/announcements/${a._id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ isActive: !a.isActive }) });
    fetchAll();
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete?')) return;
    await fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE', headers: authHeaders() });
    fetchAll();
  };

  return (
    <AdminLayout title="Manage Announcements">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Announcements</Typography>
          <Typography variant="body2" color="text.secondary">{announcements.length} total</Typography>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={openAdd}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
          New Announcement
        </Button>
      </Box>

      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                {['Title', 'Date', 'Status', 'Active', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {announcements.map((a, i) => (
                <motion.tr key={a._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} style={{ display: 'table-row' }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.description}</Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2">{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography></TableCell>
                  <TableCell>{a.badge ? <Chip label="New" size="small" color="secondary" /> : <Chip label="Regular" size="small" variant="outlined" />}</TableCell>
                  <TableCell><Switch checked={a.isActive} onChange={() => toggleActive(a)} size="small" color="success" /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(a)} sx={{ color: '#667eea' }}><Edit fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(a._id)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton></Tooltip>
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editing ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField fullWidth label="Title" size="small" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField fullWidth label="Date" size="small" type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField fullWidth label="Description" size="small" multiline rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField fullWidth label="Link (optional)" size="small" value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <FormControlLabel control={<Switch checked={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.checked }))} />} label='Show "New" badge' />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#ef4444,#dc2626)', minWidth: 100 }}>
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

export default ManageAnnouncements;
