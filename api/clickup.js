export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { token, path, method, body } = req.body;
  if (!token || !path) return res.status(400).json({ error: 'Missing token or path' });

  try {
    const r = await fetch(`https://api.clickup.com/api/v2${path}`, {
      method: method || 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await r.json();
    res.status(r.ok ? 200 : 500).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
