const supabase = require('./db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('submissions').select('data').order('updated_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data ? data.map(r => r.data) : []);
    }
    if (req.method === 'POST') {
      const subs = req.body;
      if (!Array.isArray(subs)) return res.status(400).json({ error: 'Expected array' });
      // Upsert all
      for (const sub of subs) {
        const { error } = await supabase.from('submissions').upsert({ id: sub.id, data: sub, updated_at: new Date().toISOString() });
        if (error) throw error;
      }
      // Delete removed ones
      if (subs.length > 0) {
        const ids = subs.map(s => s.id);
        const { error } = await supabase.from('submissions').delete().not('id', 'in', `(${ids.map(id => `"${id}"`).join(',')})`);
      } else {
        await supabase.from('submissions').delete().neq('id', '');
      }
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
