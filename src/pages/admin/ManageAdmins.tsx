import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Chip,
  Tooltip, CircularProgress, Snackbar, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, useTheme,
} from '@mui/material';
import { Add, Delete, LockReset } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeaders } from '../../services/api';

interface Admin { _id: string; username: string; role: string; createdAt: string; }

const ManageAdmins: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState<Admin | null>(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });
  const [resetPw, setResetPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });

  const currentUsername = (() => { try { const t = localStorage.getItem('cc_admin_token'); if (!t) return ''; return JSON.parse(atob(t.split('.')[1])).username; } catch { return ''; } })();

  const fetchAdmins = () => {
    setLoading(true);
    fetch(`${API_BASE}/admins`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setAdmins(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };
  useEffect(fetchAdmins, []);

  const handleAdd = async () => {
    if (!form.username || !form.password) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admins`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: 'Admin created!', severity: 'success' });
      setAddOpen(false); setForm({ username: '', password: '', role: 'admin' }); fetchAdmins();
    } catch (err: any) { setSnack({ open: true, msg: err.message, severity: 'error' }); } finally { setSaving(false); }
  };

  const handleReset = async () => {
    if (!resetOpen || !resetPw) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admins/${resetOpen._id}/reset-password`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ newPassword: resetPw }) });
      if (!res.ok) throw new Error((await res.json()).message);
      setSnack({ open: true, msg: 'Password reset!', severity: 'success' });
      setResetOpen(null); setResetPw('');
    } catch (err: any) { setSnack({ open: true, msg: err.message, severity: 'error' }); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this admin account?')) return;
    const res = await fetch(`${API_BASE}/admins/${id}`, { method: 'DELETE', headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) { setSnack({ open: true, msg: data.message, severity: 'error' }); return; }
    fetchAdmins();
  };

  const handleChangeSelfPassword = async () => {
    const current = prompt('Enter your current password:');
    if (!current) return;
    const next = prompt('Enter your new password:');
    if (!next) return;
    const res = await fetch(`${API_BASE}/auth/change-password`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ currentPassword: current, newPassword: next }) });
    const data = await res.json();
    setSnack({ open: true, msg: res.ok ? 'Password changed!' : data.message, severity: res.ok ? 'success' : 'error' });
  };

  return (
    <AdminLayout title="Admin Accounts">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Admin Accounts</Typography>
          <Typography variant="body2" color="text.secondary">{admins.length} active admins</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={handleChangeSelfPassword} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
            🔑 Change My Password
          </Button>
          <Button startIcon={<Add />} variant="contained" onClick={() => setAddOpen(true)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)' }}>
            Add Admin
          </Button>
        </Box>
      </Box>

      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                {['Username', 'Role', 'Created', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin, i) => (
                <motion.tr key={admin._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ display: 'table-row' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '8px', background: admin.role === 'global' ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'linear-gradient(135deg,#0ea5e9,#0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
                        {admin.username[0].toUpperCase()}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{admin.username}</Typography>
                        {admin.username === currentUsername && <Typography variant="caption" color="text.secondary">(you)</Typography>}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={admin.role === 'global' ? '👑 Global Admin' : 'Admin'} size="small"
                      sx={{ bgcolor: admin.role === 'global' ? 'rgba(102,126,234,0.15)' : 'rgba(14,165,233,0.12)', color: admin.role === 'global' ? '#667eea' : '#0ea5e9', fontWeight: 600 }} />
                  </TableCell>
                  <TableCell><Typography variant="body2">{new Date(admin.createdAt).toLocaleDateString('en-IN')}</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Reset Password"><IconButton size="small" onClick={() => { setResetOpen(admin); setResetPw(''); }} sx={{ color: '#f59e0b' }}><LockReset fontSize="small" /></IconButton></Tooltip>
                      {admin.username !== currentUsername && (
                        <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(admin._id)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton></Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Admin Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Admin Account</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField fullWidth label="Username" size="small" required value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <TextField fullWidth label="Password" size="small" type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select value={form.role} label="Role" onChange={e => setForm(p => ({ ...p, role: e.target.value }))} sx={{ borderRadius: 2 }}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="global">Global Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#0ea5e9,#0284c7)', minWidth: 120 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Create Admin'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetOpen} onClose={() => setResetOpen(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Reset Password — {resetOpen?.username}</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <TextField fullWidth label="New Password" size="small" type="password" value={resetPw} onChange={e => setResetPw(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setResetOpen(null)} sx={{ textTransform: 'none', borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleReset} variant="contained" disabled={saving || !resetPw}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#f59e0b,#d97706)', minWidth: 120 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ManageAdmins;
