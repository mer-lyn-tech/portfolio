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
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import('@vercel/kv');
      return kv;
    }
  } catch (e) {}
  return null;
}

// GET /api/activity — get all activities
app.get('/api/activity', async (req, res) => {
  try {
    const kv = await getKV();
    if (kv) {
      const keys = await kv.keys('activity:*');
      const results = await Promise.all(keys.map(k => kv.get(k)));
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
    const { date, activity, status } = req.body;
    if (!date) return res.status(400).json({ error: 'date required' });
    const record = { date, activity, status };
    const kv = await getKV();
    if (kv) {
      await kv.set(`activity:${date}`, record);
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
