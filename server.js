const express = require('express');
const pool = require('./db');
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
        const result = await pool.query('SELECT * FROM usuarios ORDER BY fecha_registro DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
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
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, descripcion, telefono) VALUES ($1, $2, $3, $4) RETURNING id',
            [nombre, email, descripcion || '', telefono || '']
        );
        res.status(201).json({
            id: result.rows[0].id,
            message: 'Usuario registrado exitosamente'
        });
    } catch (err) {
        if (err.code === '23505') { // unique_violation
            res.status(400).json({ error: 'El email ya está registrado' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    const { nombre, email, descripcion, telefono } = req.body;
    try {
        const result = await pool.query(
            'UPDATE usuarios SET nombre = $1, email = $2, descripcion = $3, telefono = $4 WHERE id = $5',
            [nombre, email, descripcion, telefono, id]
        );
        if (result.rowCount === 0) {
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
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        if (result.rowCount === 0) {
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

// Cerrar pool de PostgreSQL al cerrar la aplicación
process.on('SIGINT', () => {
    pool.end(() => {
        console.log('Conexión a la base de datos PostgreSQL cerrada');
        process.exit(0);
    });
});

