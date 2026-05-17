require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');
        await Admin.deleteMany({});
        await Admin.create([
            { nombre:'Administrador', email:'admin@esquinita.cl', password:'admin123', rol:'admin' },
            { nombre:'Cajero Turno 1', email:'cajero@esquinita.cl', password:'cajero123', rol:'cajero' }
        ]);
        console.log('\n🎉 USUARIOS CREADOS:');
        console.log('👑 Admin:  admin@esquinita.cl  / admin123');
        console.log('💼 Cajero: cajero@esquinita.cl / cajero123\n');
    } catch(e) { console.error('❌',e.message); }
    finally { await mongoose.disconnect(); }
}
seed();
