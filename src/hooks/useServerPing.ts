/**
 * useServerPing — keeps the Render backend awake by sending a GET request
 * to /api/health every `intervalMs` milliseconds (default: 4 minutes).
 *
 * Render's free tier spins down after ~15 minutes of inactivity.
 * This hook prevents that by sending a lightweight ping from the browser
 * while any page with the hook mounted is visible.
 */
import { useEffect } from 'react';
import API_BASE from '../services/api';

const DEFAULT_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

const useServerPing = (intervalMs: number = DEFAULT_INTERVAL_MS): void => {
  useEffect(() => {
    // Fire an initial ping immediately on mount so the first visit
    // also wakes the server as early as possible.
    const ping = () => {
      fetch(`${API_BASE}/health`, { method: 'GET' })
        .then(() => console.debug('[ServerPing] ✅ Backend is alive'))
        .catch(() => console.warn('[ServerPing] ⚠️ Backend ping failed'));
    };

    ping(); // immediate ping

    const id = setInterval(ping, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
};

export default useServerPing;
