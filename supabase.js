// Cargar variables de entorno
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Verificar variables de entorno
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.log('Variables encontradas:');
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
  console.log('SUPABASE_ANON_KEY:', supabaseKey ? '✅ Configurada' : '❌ Faltante');
  
  // En producción, no hacer exit
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️ Modo producción - continuando sin Supabase');
    module.exports = null;
    return;
  }
  
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Verificar conexión
supabase.from('usuarios').select('count').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
    } else {
      console.log('✅ Conexión a Supabase exitosa');
    }
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
  });

module.exports = supabase;
