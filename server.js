const express = require('express');
const sqlite3 = require('sqlite3').verbose();
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

// Inicializar base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
        initDatabase();
    }
});

// Crear tabla de usuarios si no existe
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            descripcion TEXT,
            telefono TEXT,
            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error al crear tabla:', err.message);
        } else {
            console.log('Tabla de usuarios inicializada correctamente');
        }
    });
}

// Rutas API

// Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    db.all('SELECT * FROM usuarios ORDER BY fecha_registro DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
});

// Crear nuevo usuario
app.post('/api/usuarios', (req, res) => {
    const { nombre, email, descripcion, telefono } = req.body;
    
    if (!nombre || !email) {
        return res.status(400).json({ error: 'Nombre y email son requeridos' });
    }

    db.run(
        'INSERT INTO usuarios (nombre, email, descripcion, telefono) VALUES (?, ?, ?, ?)',
        [nombre, email, descripcion || '', telefono || ''],
        function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    res.status(400).json({ error: 'El email ya está registrado' });
                } else {
                    res.status(500).json({ error: err.message });
                }
                return;
            }
            res.status(201).json({ 
                id: this.lastID, 
                message: 'Usuario registrado exitosamente' 
            });
        }
    );
});

// Actualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, email, descripcion, telefono } = req.body;
    
    db.run(
        'UPDATE usuarios SET nombre = ?, email = ?, descripcion = ?, telefono = ? WHERE id = ?',
        [nombre, email, descripcion, telefono, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Usuario no encontrado' });
            } else {
                res.json({ message: 'Usuario actualizado exitosamente' });
            }
        }
    );
});

// Eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    
    db.run('DELETE FROM usuarios WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.json({ message: 'Usuario eliminado exitosamente' });
        }
    });
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

// Cerrar conexión a la base de datos al cerrar la aplicación
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conexión a la base de datos cerrada');
        process.exit(0);
    });
});

