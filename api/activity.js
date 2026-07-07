/*
 HOW TO CONNECT VERCEL KV DATABASE:
 1. Go to vercel.com → your project dashboard
 2. Click "Storage" tab → "Create Database" → choose "KV"
 3. Name it "portfolio-activities" → Create
 4. Go to the KV database → "Settings" → ".env.local" tab
 5. Copy all 4 environment variables shown there
 6. In Vercel project → Settings → Environment Variables
 7. Add all 4 variables for Production, Preview, and Development
 8. Redeploy the project
 9. Your calendar data will now persist permanently
*/

import { kv } from '@vercel/kv'

// Stateless in-memory fallback (reused within the same serverless instance)
const memStore = {}

function useKV() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export default async function handler(req, res) {
  const hasKV = useKV();

  // GET — fetch all activities
  if (req.method === 'GET') {
    try {
      if (hasKV) {
        const keys = await kv.keys('activity:*')
        if (!keys || keys.length === 0) {
          return res.status(200).json([])
        }
        const activities = await Promise.all(
          keys.map(key => kv.get(key))
        )
        const sorted = activities
          .filter(Boolean)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
        return res.status(200).json(sorted)
      } else {
        // Fallback for missing database link
        const sorted = Object.values(memStore)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
        return res.status(200).json(sorted)
      }
    } catch (error) {
      console.error('GET error:', error)
      return res.status(500).json({ error: 'Failed to fetch activities' })
    }
  }

  // POST — save or update an activity
  if (req.method === 'POST') {
    try {
      const { date, title, activity, status } = req.body
      if (!date) {
        return res.status(400).json({ error: 'Date is required' })
      }
      const entry = { date, title, activity, status }
      if (hasKV) {
        // Save object directly — @vercel/kv handles JSON serialization
        await kv.set(`activity:${date}`, entry)
      } else {
        memStore[date] = entry
      }
      return res.status(200).json({ success: true, data: entry })
    } catch (error) {
      console.error('POST error:', error)
      return res.status(500).json({ error: 'Failed to save activity' })
    }
  }

  // DELETE — remove an activity
  if (req.method === 'DELETE') {
    try {
      const { date } = req.query
      if (!date) {
        return res.status(400).json({ error: 'Date is required' })
      }
      if (hasKV) {
        await kv.del(`activity:${date}`)
      } else {
        delete memStore[date]
      }
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('DELETE error:', error)
      return res.status(500).json({ error: 'Failed to delete activity' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
