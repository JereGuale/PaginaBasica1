const pool = require('./db');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      descripcion TEXT,
      telefono VARCHAR(50),
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Migración completada: tabla usuarios creada');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Error en la migración:', err);
  process.exit(1);
});
