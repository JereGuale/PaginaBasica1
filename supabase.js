const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://eylztlkqrbyiohwdlvio.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bHp0bGtxcmJ5aW9od2RsdmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyOTMyODQsImV4cCI6MjA3Mzg2OTI4NH0.iimTXDf8O0W_9QzvfWOmBPFtSjQ90NpUgGRo70OAfwA';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
