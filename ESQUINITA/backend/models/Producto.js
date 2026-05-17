/**
 * Modelo: Producto
 * Representa cada item del menú de La Esquinita.
 */

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['Vienesas', 'Churrascos', 'ASS', 'Empanadas Fritas', 
               'Papas Fritas', 'Salchipapas', 'Chorrillanas', 
               'Fajitas', 'Supremas & Pinchos']
    },
    descripcion: {
        type: String,
        trim: true,
        default: ''
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: 0
    },
    precioXL: {
        type: Number,
        min: 0,
        default: null
    },
    // Precio promocional (ej: 2x$6.000)
    promo: {
        activa: { type: Boolean, default: false },
        descripcion: { type: String, default: '' },   // "2x $6.000"
        precio: { type: Number, default: null }
    },
    imagen: {
        type: String,      // Ruta: "churrascos/brasileno.webp"
        default: ''
    },
    disponible: {
        type: Boolean,
        default: true
    },
    // Ingredientes que usa este producto (referencia para control de stock)
    ingredientes: [{
        ingrediente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingrediente'
        },
        cantidadNecesaria: { type: Number, default: 1 },
        unidad: { type: String, default: 'unidad' }
    }],
    orden: {
        type: Number,       // Para ordenar en el menú
        default: 0
    }
}, {
    timestamps: true        // createdAt, updatedAt automáticos
});

// Index para búsquedas rápidas
productoSchema.index({ categoria: 1, orden: 1 });
productoSchema.index({ disponible: 1 });

module.exports = mongoose.model('Producto', productoSchema);
