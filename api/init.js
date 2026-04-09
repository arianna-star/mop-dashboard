const pool = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY DEFAULT 'default',
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY DEFAULT 'default',
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    res.status(200).json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
