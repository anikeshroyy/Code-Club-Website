/**
 * Centralised API configuration.
 * In development, the backend runs on port 5000.
 * In production, set REACT_APP_API_URL to your deployed backend URL.
 */
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default API_BASE;

// ── Auth helpers ───────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('cc_admin_token');
export const setToken = (token: string): void => localStorage.setItem('cc_admin_token', token);
export const removeToken = (): void => localStorage.removeItem('cc_admin_token');
export const isLoggedIn = (): boolean => !!getToken();

export const authHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export const authHeadersForm = (): Record<string, string> => ({
  Authorization: `Bearer ${getToken()}`,
});
