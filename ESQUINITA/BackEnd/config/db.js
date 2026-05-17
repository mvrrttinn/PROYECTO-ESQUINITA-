/**
 * Conexión a MongoDB usando Mongoose.
 * La URI se obtiene desde las variables de entorno (.env).
 */

const mongoose = require('mongoose');

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/laesquinita');
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;
