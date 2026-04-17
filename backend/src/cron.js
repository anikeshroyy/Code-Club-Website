/**
 * cron.js — Scheduled background jobs for the Code Club backend.
 *
 * Jobs:
 *  1. Self-ping  (every 13 min) — keeps the Render free-tier instance awake
 *                                 so it doesn't spin down during off-hours.
 *  2. DB health  (every day 6AM) — logs MongoDB connection state to surface
 *                                  silent disconnects early.
 */

const cron = require('node-cron');
const https = require('https');
const http  = require('http');
const mongoose = require('mongoose');

// ── Helper: lightweight HTTP/HTTPS GET ───────────────────────────────────────
function ping(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      res.resume(); // drain the response body
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.setTimeout(10_000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// ── Job 1: Self-ping every 13 minutes ────────────────────────────────────────
// Render free tier spins down after ~15 min of inactivity.
// We ping our own /api/health endpoint to keep it alive 24/7.
function startSelfPing() {
  const selfUrl = process.env.SELF_URL
    ? `${process.env.SELF_URL}/api/health`
    : `http://localhost:${process.env.PORT || 5000}/api/health`;

  // '*/5 * * * *' = every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const status = await ping(selfUrl);
      console.log(`[Cron] 🏓 Self-ping → ${selfUrl} — HTTP ${status}`);
    } catch (err) {
      console.warn(`[Cron] ⚠️  Self-ping failed: ${err.message}`);
    }
  });

  console.log('[Cron] ✅ Self-ping job scheduled (every 5 min)');
}

// ── Job 2: Daily DB health check at 06:00 server time ────────────────────────
function startDbHealthCheck() {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  cron.schedule('0 6 * * *', () => {
    const state = mongoose.connection.readyState;
    const label = states[state] || 'unknown';
    if (state === 1) {
      console.log(`[Cron] 🗄️  DB health check — MongoDB is ${label}`);
    } else {
      console.error(`[Cron] ❌ DB health check — MongoDB is ${label} (state=${state})`);
    }
  });

  console.log('[Cron] ✅ DB health-check job scheduled (daily at 06:00)');
}

// ── Initialise all jobs ───────────────────────────────────────────────────────
function initCronJobs() {
  startSelfPing();
  startDbHealthCheck();
}

module.exports = initCronJobs;
