const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db.eylztlkqrbyiohwdlvio.supabase.co',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = pool;