require('dotenv').config();
const supabase = require('./supabase');

async function migrate() {
  try {
    console.log('🚀 Iniciando migración a Supabase...');
    console.log('📝 NOTA: Este script solo verifica la conexión.');
    console.log('📝 Para crear la tabla, ve al dashboard de Supabase y ejecuta:');
    console.log('');
    console.log('CREATE TABLE usuarios (');
    console.log('  id BIGSERIAL PRIMARY KEY,');
    console.log('  nombre VARCHAR(255) NOT NULL,');
    console.log('  email VARCHAR(255) UNIQUE NOT NULL,');
    console.log('  descripcion TEXT,');
    console.log('  telefono VARCHAR(50),');
    console.log('  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW()');
    console.log(');');
    console.log('');
    
    // Probar conexión
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error de conexión:', error.message);
      throw error;
    }

    console.log('✅ Conexión a Supabase exitosa');
    console.log('📊 Ahora puedes crear la tabla desde el dashboard de Supabase');
    console.log('🔗 Ve a: https://supabase.com/dashboard > SQL Editor');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en la migración:', err);
    console.log('💡 Asegúrate de que:');
    console.log('   1. Las variables de entorno estén configuradas correctamente');
    console.log('   2. Tu proyecto de Supabase esté activo');
    console.log('   3. Tengas permisos para acceder a la base de datos');
    process.exit(1);
  }
}

migrate();
