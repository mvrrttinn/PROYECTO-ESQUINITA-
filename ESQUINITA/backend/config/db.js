require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

async function connectDB() {
    const localUri = 'mongodb://127.0.0.1:27017/test';
    const connectionUri = process.env.MONGO_URI?.trim();
    const resolvedUri = connectionUri || (process.env.NODE_ENV === 'production' ? null : localUri);

    if (!resolvedUri) {
        throw new Error('MONGO_URI no está definido.');
    }

    const uriSegura = resolvedUri.includes('@')
        ? resolvedUri.replace(/:([^@]+)@/, ':****@')
        : resolvedUri;
    console.log(`🔗 Intentando conectar a: ${uriSegura}`);

    try {
        const conn = await mongoose.connect(resolvedUri);
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        return;
    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB (${uriSegura}): ${error.message}`);
        throw new Error('No se pudo conectar a MongoDB');
    }
}

module.exports = connectDB;