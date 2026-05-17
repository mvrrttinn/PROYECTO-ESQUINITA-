require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;
const frontendPath = path.resolve(__dirname, '..');

// ─── Debug: ver qué hay en cada carpeta ───
console.log('📂 Frontend path:', frontendPath);
try {
    const contenido = fs.readdirSync(frontendPath);
    console.log('📁 Raíz:', contenido);
    ['pages', 'js', 'css', 'components'].forEach(carpeta => {
        const ruta = path.join(frontendPath, carpeta);
        if (fs.existsSync(ruta)) {
            console.log(`  📂 ${carpeta}/`, fs.readdirSync(ruta));
        } else {
            console.log(`  ❌ ${carpeta}/ NO EXISTE`);
        }
    });
} catch (e) {
    console.error('Error en debug:', e.message);
}

// ─── Middlewares ───
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Log de cada petición ───
app.use((req, res, next) => {
    const filePath = path.join(frontendPath, req.url.split('?')[0]);
    const existe = fs.existsSync(filePath);
    console.log(`📄 ${req.method} ${req.url} → ${existe ? '✅ existe' : '❌ no existe'} → ${filePath}`);
    next();
});

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
app.use(express.static(frontendPath));

// ─── Catch-all ───
app.get('*', (req, res) => {
    if (path.extname(req.url)) {
        return res.status(404).send('Archivo no encontrado');
    }
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
            console.log(`🚀 Servidor escuchando en http://0.0.0.0:${PORT}`);
            console.log(`📡 API: /api/health`);
            console.log('==================================================\n');
        });
    } catch (error) {
        console.error('❌ No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();