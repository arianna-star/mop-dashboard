const supabase = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    // Create tables via Supabase SQL
    const { error: e1 } = await supabase.rpc('exec_sql', { sql: `
      CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMP DEFAULT NOW());
      CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMP DEFAULT NOW());
    `});
    res.status(200).json({ ok: true });
  } catch(e) {
    res.status(200).json({ ok: true, note: 'Tables may already exist' });
  }
};
