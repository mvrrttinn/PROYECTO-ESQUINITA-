/**
 * Rutas: /api/pedidos
 * Crear pedidos, listar, actualizar estado.
 */

const router = require('express').Router();
const Pedido = require('../models/Pedido');
const Ingrediente = require('../models/Ingrediente');

// GET /api/pedidos — Listar pedidos (filtros: estado, fecha)
router.get('/', async (req, res, next) => {
    try {
        const filtro = {};
        if (req.query.estado) filtro.estado = req.query.estado;
        if (req.query.fecha) {
            const fecha = new Date(req.query.fecha);
            filtro.createdAt = {
                $gte: new Date(fecha.setHours(0, 0, 0, 0)),
                $lt: new Date(fecha.setHours(23, 59, 59, 999))
            };
        }

        const pedidos = await Pedido.find(filtro).sort({ createdAt: -1 });
        res.json({ total: pedidos.length, pedidos });
    } catch (err) { next(err); }
});

// GET /api/pedidos/:id — Obtener un pedido
router.get('/:id', async (req, res, next) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json(pedido);
    } catch (err) { next(err); }
});

// POST /api/pedidos — Crear nuevo pedido
router.post('/', async (req, res, next) => {
    try {
        const { productos, total, metodoPago, cliente, delivery, notas } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).json({ error: 'El pedido debe tener al menos un producto' });
        }

        const pedido = await Pedido.create({
            productos, total, metodoPago, cliente, delivery, notas
        });

        res.status(201).json({
            mensaje: '✅ Pedido creado exitosamente',
            pedido
        });
    } catch (err) { next(err); }
});

// PATCH /api/pedidos/:id/estado — Actualizar estado del pedido
router.patch('/:id/estado', async (req, res, next) => {
    try {
        const { estado } = req.body;
        const estadosValidos = ['pendiente', 'confirmado', 'preparando', 'en_camino', 'entregado', 'cancelado'];

        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ error: `Estado inválido. Válidos: ${estadosValidos.join(', ')}` });
        }

        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        );
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

        // Si se confirma el pedido, descontar stock de ingredientes (futuro)
        // Aquí se podría implementar la lógica de descuento automático

        res.json({ mensaje: `✅ Pedido actualizado a: ${estado}`, pedido });
    } catch (err) { next(err); }
});

// GET /api/pedidos/stats/resumen — Estadísticas del día
router.get('/stats/resumen', async (req, res, next) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        const pedidosHoy = await Pedido.find({
            createdAt: { $gte: hoy, $lt: manana }
        });

        const totalVentas = pedidosHoy.reduce((sum, p) => sum + p.total, 0);
        const porEstado = {};
        pedidosHoy.forEach(p => {
            porEstado[p.estado] = (porEstado[p.estado] || 0) + 1;
        });

        res.json({
            fecha: hoy.toISOString().split('T')[0],
            totalPedidos: pedidosHoy.length,
            totalVentas,
            porEstado,
            porMetodoPago: {
                efectivo: pedidosHoy.filter(p => p.metodoPago === 'efectivo').length,
                debito: pedidosHoy.filter(p => p.metodoPago === 'debito').length,
                transferencia: pedidosHoy.filter(p => p.metodoPago === 'transferencia').length
            }
        });
    } catch (err) { next(err); }
});

module.exports = router;
