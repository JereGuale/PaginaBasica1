require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase - NECESITAS CONFIGURAR ESTAS VARIABLES
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Las variables SUPABASE_URL y SUPABASE_ANON_KEY deben estar configuradas en el archivo .env');
  console.log('📝 Crea un archivo .env con las siguientes variables:');
  console.log('SUPABASE_URL=tu_url_de_supabase');
  console.log('SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
