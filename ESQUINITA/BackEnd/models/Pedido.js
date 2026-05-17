/**
 * Modelo: Pedido
 * Cada orden que un cliente hace a La Esquinita.
 */

const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    // Número de pedido auto-incremental
    numeroPedido: {
        type: String,
        unique: true
    },
    productos: [{
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true, min: 1 },
        categoria: { type: String, default: 'General' }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    metodoPago: {
        type: String,
        enum: ['efectivo', 'debito', 'transferencia'],
        required: [true, 'El método de pago es obligatorio']
    },
    cliente: {
        nombre: { type: String, default: '' },
        telefono: { type: String, default: '' },
        direccion: { type: String, default: '' }
    },
    delivery: {
        type: Boolean,
        default: false
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    notas: {
        type: String,
        default: ''
    },
    // Comprobante de transferencia (si aplica)
    comprobanteTransferencia: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generar número de pedido antes de guardar
pedidoSchema.pre('save', async function (next) {
    if (!this.numeroPedido) {
        const fecha = new Date();
        const prefix = `LE-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}`;
        const count = await this.constructor.countDocuments({
            createdAt: {
                $gte: new Date(fecha.setHours(0, 0, 0, 0)),
                $lt: new Date(fecha.setHours(23, 59, 59, 999))
            }
        });
        this.numeroPedido = `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

pedidoSchema.index({ estado: 1, createdAt: -1 });

module.exports = mongoose.model('Pedido', pedidoSchema);
