require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

const fs = require('fs');
const frontendPath = path.join(__dirname, '..');

// ─── Debug completo ───
console.log('📂 Frontend path:', frontendPath);
const contenido = fs.readdirSync(frontendPath);
console.log('📁 Raíz:', contenido);

// Buscar la carpeta pages con cualquier nombre
contenido.forEach(item => {
    const ruta = path.join(frontendPath, item);
    if (fs.statSync(ruta).isDirectory()) {
        console.log(`  📂 ${item}/`, fs.readdirSync(ruta));
    }
});
// ─── Middlewares ───
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── API Routes ───
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/ingredientes', require('./routes/ingredientes'));
app.use('/api/config', require('./routes/config'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', mensaje: 'La Esquinita Backend OK', timestamp: new Date().toISOString() });
});

// ─── Frontend estático ───
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    if (path.extname(req.url)) {
        return res.status(404).send('Archivo no encontrado');
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ─── Error Handler ───
app.use(errorHandler);

// ─── Iniciar Servidor (UNA SOLA VEZ) ───
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, '0.0.0.0', () => {
            console.log('\n==================================================');
            console.log('🌭 LA ESQUINITA - Servidor Iniciado');
            console.log('==================================================');
            console.log(`🚀 Servidor escuchando en http://0.0.0.0:${PORT}`);
            console.log(`📡 API: /api/health`);
            console.log('==================================================\n');
        });
    } catch (error) {
        console.error('❌ No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
}

// ─── SOLO UNA llamada ───
startServer();