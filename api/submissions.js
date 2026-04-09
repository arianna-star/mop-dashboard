import pool from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT data FROM submissions ORDER BY (data->>\'created\') DESC'
      );
      const subs = result.rows.map(r => r.data);
      return res.status(200).json(subs);
    }

    if (req.method === 'POST') {
      const subs = req.body;
      if (!Array.isArray(subs)) return res.status(400).json({ error: 'Expected array' });

      // Upsert all submissions
      for (const sub of subs) {
        await pool.query(
          `INSERT INTO submissions (id, data, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW()`,
          [sub.id, JSON.stringify(sub)]
        );
      }

      // Delete submissions no longer in the list
      if (subs.length > 0) {
        const ids = subs.map(s => s.id);
        await pool.query(
          `DELETE FROM submissions WHERE id != ALL($1::text[])`,
          [ids]
        );
      } else {
        await pool.query('DELETE FROM submissions');
      }

      return res.status(200).json({ ok: true });
    }

    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
