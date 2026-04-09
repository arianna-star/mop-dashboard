const pool = require('./db');

const DEF = {
  bm: [
    { id: 'real-mushrooms', name: 'Real Mushrooms', color: '#f5a93a' },
    { id: 'future-method', name: 'Future Method', color: '#f5a93a' },
    { id: 'total-hydration', name: 'Total Hydration', color: '#f5a93a' },
    { id: 'primitive-scientific', name: 'Primitive Scientific', color: '#f5a93a' },
    { id: 'vitamin-iq', name: 'Vitamin IQ', color: '#f5a93a' },
    { id: 'joymode', name: 'Joymode', color: '#e05555' },
    { id: 'wam-mints', name: 'WAM Mints', color: '#e05555' },
    { id: 'pineapple', name: 'Pineapple', color: '#e05555' },
    { id: 'ua-body-skincare', name: 'UA Body Skincare', color: '#e05555' },
    { id: 'best-life-4-pets', name: 'Best Life 4 Pets', color: '#e05555' },
    { id: 'future-kind', name: 'Future Kind', color: '#e05555' },
    { id: 'wild-yam-naturals', name: 'Wild Yam Naturals', color: '#e05555' },
  ],
  ob: [
    { id: 'ob-primemd', name: 'OB - PrimeMD', color: '#ff9f6b' },
    { id: 'ob-medchoice', name: 'OB - MedChoice', color: '#f5a93a' },
    { id: 'ob-nusava', name: 'OB - Nusava', color: '#1fd4a0' },
    { id: 'ob-digital', name: 'OB - Digital', color: '#4bbfb0' },
  ]
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const result = await pool.query("SELECT data FROM clients WHERE id = 'default'");
      return res.status(200).json(result.rows.length === 0 ? DEF : result.rows[0].data);
    }
    if (req.method === 'POST') {
      await pool.query(
        `INSERT INTO clients (id, data, updated_at) VALUES ('default', $1, NOW())
         ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()`,
        [JSON.stringify(req.body)]
      );
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
