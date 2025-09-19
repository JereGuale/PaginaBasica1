const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'db.eylztlkqrbyiohwdlvio.supabase.co',
  database: 'postgres',
  password: '1234',
  port: 5432,
});

module.exports = pool;