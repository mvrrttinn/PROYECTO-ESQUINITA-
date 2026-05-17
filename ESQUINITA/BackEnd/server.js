/**
 * =====================================================
 *  LA ESQUINITA - Servidor Backend (server.js)
 * =====================================================
 *  Stack: Node.js + Express + MongoDB (Mongoose)
 *  Puerto: 4000 (configurable via .env)
 * =====================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// ===== CONEXIÓN A BASE DE DATOS =====
connectDB();

// ===== MIDDLEWARES =====
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== RUTAS =====
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/ingredientes', require('./routes/ingredientes'));

// ===== RUTA DE SALUD (health check) =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        mensaje: '🌭 La Esquinita Backend funcionando',
        timestamp: new Date().toISOString()
    });
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
    console.log(`🌭 La Esquinita Backend corriendo en http://localhost:${PORT}`);
    console.log(`📋 API Docs: http://localhost:${PORT}/api/health`);
});
