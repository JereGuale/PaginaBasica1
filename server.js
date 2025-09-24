// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Importar Supabase después de cargar dotenv
let supabase;
try {
  supabase = require('./supabase');
} catch (error) {
  console.error('Error cargando Supabase:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✨ Usa ruta absoluta a /public
app.use(express.static(path.join(__dirname, 'public')));

// --- Rutas API ---
app.get('/api/usuarios', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Base de datos no configurada' });
    }
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('fecha_registro', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error en /api/usuarios:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Base de datos no configurada' });
    }
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    console.error('Error en /api/usuarios/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/usuarios', async (req, res) => {
  const { nombre, email, descripcion, telefono } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, descripcion: descripcion || '', telefono: telefono || '' }])
      .select('id')
      .single();
    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      throw error;
    }
    res.status(201).json({ id: data.id, message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const { nombre, email, descripcion, telefono } = req.body;
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ nombre, email, descripcion, telefono })
      .eq('id', id)
      .select('id');
    if (error) throw error;
    if (!data || data.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario actualizado exitosamente' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw error;
    if (!data || data.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario eliminado exitosamente' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ⚠️ En Vercel (serverless) NO uses app.listen. Exporta el handler:
if (!process.env.VERCEL) {
  // Solo en local
  app.listen(PORT, () => {
    console.log(`Servidor local en http://localhost:${PORT}`);
  });
}

// Para Vercel:
module.exports = app;
// O alternativamente:
// module.exports = (req, res) => app(req, res);


