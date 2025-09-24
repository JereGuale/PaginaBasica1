// Configuración de variables de entorno para Vercel
if (process.env.NODE_ENV === 'production') {
  // En producción, las variables vienen de Vercel
  console.log('Modo producción - usando variables de Vercel');
} else {
  // En desarrollo, usar dotenv
  require('dotenv').config();
}

module.exports = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  nodeEnv: process.env.NODE_ENV || 'development'
};
