const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.mopdb_POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
