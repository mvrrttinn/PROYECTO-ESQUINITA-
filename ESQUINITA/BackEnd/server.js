require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/ingredientes', require('./routes/ingredientes'));
app.use('/api/config', require('./routes/config'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.get('/api/health', (req, res) => {
    res.json({ status:'OK', mensaje:'La Esquinita Backend OK', timestamp: new Date().toISOString() });
});

// Frontend
const fp = path.join(__dirname, '..');
app.use(express.static(fp));
app.get('*', (req, res) => res.sendFile(path.join(fp, 'index.html')));

app.use(errorHandler);

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log('\n==================================================');
            console.log('🌭 LA ESQUINITA - Servidor Iniciado');
            console.log('==================================================');
            console.log(`🌐 Sitio:   http://localhost:${PORT}`);
            console.log(`🔐 Admin:   http://localhost:${PORT}/pages/admin/login.html`);
            console.log(`📡 API:     http://localhost:${PORT}/api/health`);
            console.log('==================================================\n');
        });
    } catch (error) {
        console.error('❌ No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();
