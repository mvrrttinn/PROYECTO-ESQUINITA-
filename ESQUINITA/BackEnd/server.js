require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middlewares ───
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Ruta al frontend (un nivel arriba de backend/) ───
const frontendPath = path.join(__dirname, '..');

// ─── API Routes ───
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/ingredientes', require('./routes/ingredientes'));
app.use('/api/config', require('./routes/config'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        mensaje: 'La Esquinita Backend OK', 
        timestamp: new Date().toISOString() 
    });
});

// ─── Archivos estáticos del frontend ───
// Sirve CSS, JS, imágenes, y TODAS las páginas HTML
app.use(express.static(frontendPath));

// ─── Log para debug (puedes quitarlo después) ───
app.use((req, res, next) => {
    console.log(`📄 Petición: ${req.method} ${req.url}`);
    next();
});

// ─── Catch-all: SOLO para rutas que NO sean API ni archivos existentes ───
app.get('*', (req, res) => {
    // Si la ruta pide un archivo específico (.html, .css, .js, etc.)
    // y no se encontró en static, devuelve 404
    if (path.extname(req.url)) {
        return res.status(404).send('Archivo no encontrado');
    }
    // Si es una ruta sin extensión, devuelve index.html
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ─── Error Handler ───
app.use(errorHandler);

// ─── Iniciar Servidor ───
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, '0.0.0.0', () => {
            console.log('\n==================================================');
            console.log('🌭 LA ESQUINITA - Servidor Iniciado');
            console.log('==================================================');
            console.log(`🌐 Puerto:     ${PORT}`);
            console.log(`📂 Frontend:   ${frontendPath}`);
            console.log(`📡 API:        /api/health`);
            console.log('==================================================\n');
        });
    } catch (error) {
        console.error('❌ No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();