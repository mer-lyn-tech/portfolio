// api/activity.js — Upstash Redis via direct REST fetch (no @vercel/kv dependency)
// This works on Vercel serverless functions with any Upstash Redis instance.
//
// REQUIRED ENVIRONMENT VARIABLES (set in Vercel Dashboard → Settings → Environment Variables):
//   UPSTASH_REDIS_REST_URL   — e.g. https://xxx.upstash.io
//   UPSTASH_REDIS_REST_TOKEN — your Upstash REST token

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// ── Low-level Upstash REST helper ──
async function redis(...args) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    throw new Error('Redis env vars not set: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required');
  }
  const res = await fetch(`${REDIS_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Redis HTTP ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.result;
}

export default async function handler(req, res) {
  // Debug: log env status on every request (visible in Vercel function logs)
  console.log('ENV CHECK:', {
    url: REDIS_URL ? 'SET (' + REDIS_URL.slice(0, 30) + '...)' : 'MISSING',
    token: REDIS_TOKEN ? 'SET' : 'MISSING',
  });

  // ── GET — fetch all activities ──
  if (req.method === 'GET') {
    if (!REDIS_URL || !REDIS_TOKEN) {
      console.error('GET: Redis env vars not configured');
      return res.status(200).json([]);
    }
    try {
      // Get all dates from the index set
      const dates = await redis('SMEMBERS', 'activity:index');
      if (!dates || dates.length === 0) {
        return res.status(200).json([]);
      }
      // Fetch all entries in parallel
      const entries = await Promise.all(
        dates.map(async (date) => {
          const val = await redis('GET', `activity:${date}`);
          if (!val) return null;
          // Upstash returns strings — parse if needed
          if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return null; }
          }
          return val; // already an object
        })
      );
      const sorted = entries
        .filter(Boolean)
        .sort((a, b) => (a.date > b.date ? 1 : -1));
      return res.status(200).json(sorted);
    } catch (err) {
      console.error('GET error:', err.message);
      return res.status(200).json([]); // never crash the page
    }
  }

  // ── POST — save or update an activity ──
  if (req.method === 'POST') {
    if (!REDIS_URL || !REDIS_TOKEN) {
      return res.status(500).json({ error: 'Database not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel Environment Variables.' });
    }
    try {
      // Safely parse body (may already be an object or a raw string)
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { date, title, activity, status, dayNum } = body || {};

      if (!date) {
        return res.status(400).json({ error: 'date is required' });
      }

      const entry = { date, title: title || '', activity: activity || '', status: status || 'Completed', dayNum: dayNum || 1 };

      // Store entry as JSON string under key activity:YYYY-MM-DD
      await redis('SET', `activity:${date}`, JSON.stringify(entry));
      // Add date to the index set so we can enumerate all entries
      await redis('SADD', 'activity:index', date);

      console.log('POST: saved entry for', date);
      return res.status(200).json({ success: true, data: entry });
    } catch (err) {
      console.error('POST error:', err.message);
      return res.status(500).json({ error: `Failed to save activity: ${err.message}` });
    }
  }

  // ── DELETE — remove an activity ──
  if (req.method === 'DELETE') {
    if (!REDIS_URL || !REDIS_TOKEN) {
      return res.status(500).json({ error: 'Database not configured.' });
    }
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ error: 'date query param is required' });
      }
      await redis('DEL', `activity:${date}`);
      await redis('SREM', 'activity:index', date);
      console.log('DELETE: removed entry for', date);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('DELETE error:', err.message);
      return res.status(500).json({ error: `Failed to delete: ${err.message}` });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
