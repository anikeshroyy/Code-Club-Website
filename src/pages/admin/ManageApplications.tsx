import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Chip,
  Tooltip, CircularProgress, Snackbar, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tabs, Tab, useTheme,
} from '@mui/material';
import { Visibility, Delete, CheckCircle, Cancel, HourglassEmpty } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import API_BASE, { authHeaders } from '../../services/api';

interface Application {
  _id: string; name: string; email: string; regNumber: string; college: string;
  branch: string; year: string; phone: string; interests: string;
  status: 'pending' | 'approved' | 'rejected'; adminNotes: string; createdAt: string;
}

const statusConfig = {
  pending:  { color: '#f59e0b', icon: <HourglassEmpty />,  label: 'Pending'  },
  approved: { color: '#10b981', icon: <CheckCircle />,      label: 'Approved' },
  rejected: { color: '#ef4444', icon: <Cancel />,           label: 'Rejected' },
};

const ManageApplications: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<Application | null>(null);
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState<Application['status']>('pending');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' as 'success' | 'error' });

  const fetchAll = () => {
    setLoading(true);
    fetch(`${API_BASE}/join`, { headers: authHeaders() })
      .then(r => r.json()).then(d => setApplications(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  };
  useEffect(fetchAll, []);

  const tabFilters: Array<Application['status'] | 'all'> = ['all', 'pending', 'approved', 'rejected'];
  const displayed = tab === 0 ? applications : applications.filter(a => a.status === tabFilters[tab]);

  const openDetail = (a: Application) => { setSelected(a); setNotes(a.adminNotes); setNewStatus(a.status); };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/join/${selected._id}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ status: newStatus, adminNotes: notes }),
      });
      if (!res.ok) throw new Error('Update failed');
      setSnack({ open: true, msg: 'Application updated!', severity: 'success' });
      setSelected(null); fetchAll();
    } catch { setSnack({ open: true, msg: 'Update failed', severity: 'error' }); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this application?')) return;
    await fetch(`${API_BASE}/join/${id}`, { method: 'DELETE', headers: authHeaders() });
    fetchAll();
  };

  const counts = { all: applications.length, pending: applications.filter(a => a.status === 'pending').length, approved: applications.filter(a => a.status === 'approved').length, rejected: applications.filter(a => a.status === 'rejected').length };

  return (
    <AdminLayout title="Join Applications">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Membership Applications</Typography>
        <Typography variant="body2" color="text.secondary">{counts.all} total · {counts.pending} pending review</Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }} TabIndicatorProps={{ style: { background: 'linear-gradient(90deg,#667eea,#764ba2)' } }}>
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((label, i) => (
          <Tab key={label} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            {label}
            <Chip label={counts[tabFilters[i]]} size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: i === 1 && counts.pending > 0 ? '#ef4444' : undefined, color: i === 1 && counts.pending > 0 ? 'white' : undefined }} />
          </Box>} />
        ))}
      </Tabs>

      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box> : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'}` }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                {['Applicant', 'Reg. No', 'Branch / Year', 'Applied On', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.map((a, i) => (
                <motion.tr key={a._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} style={{ display: 'table-row' }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{a.email}</Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2">{a.regNumber}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{a.branch}, Year {a.year}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography></TableCell>
                  <TableCell>
                    <Chip
                      icon={statusConfig[a.status].icon}
                      label={statusConfig[a.status].label}
                      size="small"
                      sx={{ bgcolor: statusConfig[a.status].color + '20', color: statusConfig[a.status].color, fontWeight: 600, '& .MuiChip-icon': { color: statusConfig[a.status].color, fontSize: '0.9rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View / Update"><IconButton size="small" onClick={() => openDetail(a)} sx={{ color: '#667eea' }}><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(a._id)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton></Tooltip>
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
              {displayed.length === 0 && (
                <TableRow><TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>No applications found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Detail / Update Dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Application Details</DialogTitle>
        {selected && (
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
              {[['Name', selected.name], ['Email', selected.email], ['Reg. No', selected.regNumber], ['College', selected.college], ['Branch', selected.branch], ['Year', selected.year], ['Phone', selected.phone]].map(([label, value]) => (
                <Box key={label}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
                </Box>
              ))}
              {selected.interests && (
                <Box sx={{ gridColumn: '1/-1' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Interests</Typography>
                  <Typography variant="body2">{selected.interests}</Typography>
                </Box>
              )}
            </Box>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select value={newStatus} label="Status" onChange={e => setNewStatus(e.target.value as Application['status'])} sx={{ borderRadius: 2 }}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Admin Notes" size="small" multiline rows={3} value={notes} onChange={e => setNotes(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setSelected(null)} sx={{ textTransform: 'none', borderRadius: 2 }}>Close</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={saving}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg,#667eea,#764ba2)', minWidth: 100 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ManageApplications;
