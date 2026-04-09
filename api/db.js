const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.mopdb_SUPABASE_URL,
  process.env.mopdb_SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;
