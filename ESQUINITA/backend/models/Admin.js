const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const s = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    rol: { type: String, enum: ['admin','cajero'], default: 'cajero' },
    activo: { type: Boolean, default: true }
}, { timestamps: true });
s.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
s.methods.compararPassword = function(c) { return bcrypt.compare(c, this.password); };
module.exports = mongoose.model('Admin', s);
