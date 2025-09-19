const express = require('express');
const supabase = require('./supabase');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// La migración y conexión se realiza con migrate.js y db.js

// Rutas API

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('fecha_registro', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    try {
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
        res.status(500).json({ error: err.message });
    }
});

// Crear nuevo usuario
app.post('/api/usuarios', async (req, res) => {
    const { nombre, email, descripcion, telefono } = req.body;
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([
                {
                    nombre,
                    email,
                    descripcion: descripcion || '',
                    telefono: telefono || ''
                }
            ])
            .select('id')
            .single();
        
        if (error) {
            if (error.code === '23505') { // unique_violation
                return res.status(400).json({ error: 'El email ya está registrado' });
            }
            throw error;
        }
        
        res.status(201).json({
            id: data.id,
            message: 'Usuario registrado exitosamente'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, email, descripcion, telefono } = req.body;
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .update({
                nombre,
                email,
                descripcion,
                telefono
            })
            .eq('id', id)
            .select('id');
        
        if (error) throw error;
        
        if (data.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json({ message: 'Usuario actualizado exitosamente' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id)
            .select('id');
        
        if (error) throw error;
        
        if (data.length === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json({ message: 'Usuario eliminado exitosamente' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Visita http://localhost:${PORT} para ver la aplicación`);
});

// Cerrar aplicación
process.on('SIGINT', () => {
    console.log('Aplicación cerrada');
    process.exit(0);
});


