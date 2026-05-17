/**
 * Conexión a MongoDB usando Mongoose.
 * La URI se obtiene desde las variables de entorno (.env).
 */

const mongoose = require('mongoose');

async function connectDB() {
    const localUri = 'mongodb://localhost:27017/laesquinita';
    const connectionUri = process.env.MONGO_URI || localUri;

    try {
        const conn = await mongoose.connect(connectionUri);
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        return;
    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB (${connectionUri}): ${error.message}`);

        if (connectionUri !== localUri) {
            console.warn('⚠️ Intentando fallback a MongoDB local...');
            try {
                const conn = await mongoose.connect(localUri);
                console.log(`✅ MongoDB local conectado: ${conn.connection.host}`);
                return;
            } catch (localError) {
                console.error(`❌ Error de conexión a MongoDB local: ${localError.message}`);
            }
        }

        throw new Error('No se pudo conectar a MongoDB');
    }
}

module.exports = connectDB;
