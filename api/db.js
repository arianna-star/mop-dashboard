import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.mopdb_POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

export default pool;
