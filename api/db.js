const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.mopdb_POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;