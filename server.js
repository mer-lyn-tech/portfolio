import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory fallback store (used when Vercel KV is not configured)
const memStore = {};

async function getKV() {
  try {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      const { createClient } = await import('@vercel/kv');
      return createClient({ url, token });
    }
  } catch (e) {}
  return null;
}

// GET /api/activity — get all activities
app.get('/api/activity', async (req, res) => {
  try {
    const kv = await getKV();
    if (kv) {
      const dates = await kv.smembers('activity:index');
      if (!dates || dates.length === 0) {
        return res.json([]);
      }
      const results = await Promise.all(dates.map(date => kv.get(`activity:${date}`)));
      return res.json(results.filter(Boolean));
    }
    // In-memory fallback
    return res.json(Object.values(memStore));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/activity — upsert activity
app.post('/api/activity', async (req, res) => {
  try {
    const { date, title, activity, status } = req.body;
    if (!date) return res.status(400).json({ error: 'date required' });
    const record = { date, title, activity, status };
    const kv = await getKV();
    if (kv) {
      await kv.set(`activity:${date}`, record);
      await kv.sadd('activity:index', date);
    } else {
      memStore[date] = record;
    }
    res.json({ success: true, record });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/activity?date=YYYY-MM-DD
app.delete('/api/activity', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date required' });
    const kv = await getKV();
    if (kv) {
      await kv.del(`activity:${date}`);
      await kv.srem('activity:index', date);
    } else {
      delete memStore[date];
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
