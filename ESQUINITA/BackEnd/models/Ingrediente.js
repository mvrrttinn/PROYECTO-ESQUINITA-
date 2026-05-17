/**
 * Modelo: Ingrediente
 * Control de stock de ingredientes.
 * Cuando un ingrediente baja del stockMinimo se genera una alerta.
 */

const mongoose = require('mongoose');

const ingredienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del ingrediente es obligatorio'],
        trim: true,
        unique: true
    },
    categoria: {
        type: String,
        enum: ['Carnes', 'Verduras', 'Salsas', 'Pan', 'Quesos', 'Embutidos', 'Otros'],
        default: 'Otros'
    },
    stockActual: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    stockMinimo: {
        type: Number,
        required: true,
        min: 0,
        default: 5
    },
    unidad: {
        type: String,
        enum: ['kg', 'unidad', 'litro', 'paquete', 'bandeja', 'bolsa'],
        default: 'unidad'
    },
    costoUnitario: {
        type: Number,
        min: 0,
        default: 0
    },
    proveedor: {
        type: String,
        default: ''
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Propiedad virtual: ¿está bajo en stock?
ingredienteSchema.virtual('stockBajo').get(function () {
    return this.stockActual <= this.stockMinimo;
});

// Incluir virtuals en JSON
ingredienteSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Ingrediente', ingredienteSchema);
    