/**
 * Rutas: /api/ingredientes
 * CRUD de ingredientes + alertas de stock bajo.
 */

const router = require('express').Router();
const Ingrediente = require('../models/Ingrediente');

// GET /api/ingredientes — Listar todos (o solo activos)
router.get('/', async (req, res, next) => {
    try {
        const filtro = {};
        if (req.query.activo !== undefined) filtro.activo = req.query.activo === 'true';
        if (req.query.categoria) filtro.categoria = req.query.categoria;

        const ingredientes = await Ingrediente.find(filtro).sort({ categoria: 1, nombre: 1 });
        res.json({ total: ingredientes.length, ingredientes });
    } catch (err) { next(err); }
});

// GET /api/ingredientes/alertas — Ingredientes con stock bajo
router.get('/alertas', async (req, res, next) => {
    try {
        const ingredientes = await Ingrediente.find({ activo: true });
        const alertas = ingredientes
            .filter(i => i.stockActual <= i.stockMinimo)
            .map(i => ({
                _id: i._id,
                nombre: i.nombre,
                categoria: i.categoria,
                stockActual: i.stockActual,
                stockMinimo: i.stockMinimo,
                unidad: i.unidad,
                porcentaje: i.stockMinimo > 0
                    ? Math.round((i.stockActual / i.stockMinimo) * 100) : 0
            }));

        res.json({
            totalAlertas: alertas.length,
            alertas,
            mensaje: alertas.length > 0
                ? `⚠️ ${alertas.length} ingrediente(s) con stock bajo`
                : '✅ Todos los ingredientes tienen stock suficiente'
        });
    } catch (err) { next(err); }
});

// POST /api/ingredientes — Crear ingrediente
router.post('/', async (req, res, next) => {
    try {
        const ingrediente = await Ingrediente.create(req.body);
        res.status(201).json({ mensaje: '✅ Ingrediente creado', ingrediente });
    } catch (err) { next(err); }
});

// PUT /api/ingredientes/:id — Actualizar ingrediente
router.put('/:id', async (req, res, next) => {
    try {
        const ingrediente = await Ingrediente.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!ingrediente) return res.status(404).json({ error: 'Ingrediente no encontrado' });
        res.json({ mensaje: '✅ Ingrediente actualizado', ingrediente });
    } catch (err) { next(err); }
});

// PATCH /api/ingredientes/:id/stock — Ajustar stock (sumar o restar)
router.patch('/:id/stock', async (req, res, next) => {
    try {
        const { cantidad, operacion } = req.body;
        // operacion: 'sumar' o 'restar'
        if (!['sumar', 'restar'].includes(operacion)) {
            return res.status(400).json({ error: 'Operación inválida. Usar: sumar o restar' });
        }

        const ingrediente = await Ingrediente.findById(req.params.id);
        if (!ingrediente) return res.status(404).json({ error: 'Ingrediente no encontrado' });

        if (operacion === 'sumar') {
            ingrediente.stockActual += cantidad;
        } else {
            ingrediente.stockActual = Math.max(0, ingrediente.stockActual - cantidad);
        }

        await ingrediente.save();

        const alerta = ingrediente.stockActual <= ingrediente.stockMinimo
            ? `⚠️ Stock bajo: ${ingrediente.stockActual} ${ingrediente.unidad}(s) restantes`
            : null;

        res.json({
            mensaje: `✅ Stock actualizado: ${ingrediente.stockActual} ${ingrediente.unidad}(s)`,
            ingrediente,
            alerta
        });
    } catch (err) { next(err); }
});

// DELETE /api/ingredientes/:id
router.delete('/:id', async (req, res, next) => {
    try {
        const ingrediente = await Ingrediente.findByIdAndDelete(req.params.id);
        if (!ingrediente) return res.status(404).json({ error: 'Ingrediente no encontrado' });
        res.json({ mensaje: '🗑️ Ingrediente eliminado' });
    } catch (err) { next(err); }
});

module.exports = router;
