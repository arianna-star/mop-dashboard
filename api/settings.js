const pool = require('./db');

const DEF = {
  adminPw: 'admin',
  slackWebhook: '',
  slackChannel: '#content-feedback',
  clickupToken: '',
  clientPasswords: {},
  clientManagers: {},
  team: [],
  templates: {
    slackFeedback: '📋 *Feedback received on {taskName}*\n\n*Client:* {client}\n*Type:* {type} V{version}\n*Status:* {status}\n*Designer:* {designer}\n\n*Feedback:*\n{feedback}',
    slackNewSub: '📬 *New Submission: {taskName}*\n\n*Client:* {client}\n*Type:* {type} V{version}\n*Designer:* {designer}\n*Marketplace:* {marketplace}\n*Client Manager:* {clientManager}\n{link}',
    clickupFeedback: '📋 MarketplaceOps Feedback\n\nDesigner: {designer}\n{admins}\n\n{feedback}',
    clickupReady: '✅ Ready for Upload to Amazon\n\nAsset: {taskName}\nClient: {client}\nType: {type} V{version}\nMarketplace: {marketplace}\n{asin}\nDesigner: {designer}\n\nThis asset is ready to upload to Amazon.'
  }
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'GET') {
      const result = await pool.query("SELECT data FROM settings WHERE id = 'default'");
      if (result.rows.length === 0) return res.status(200).json(DEF);
      return res.status(200).json(Object.assign({}, DEF, result.rows[0].data));
    }
    if (req.method === 'POST') {
      await pool.query(
        `INSERT INTO settings (id, data, updated_at) VALUES ('default', $1, NOW())
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
