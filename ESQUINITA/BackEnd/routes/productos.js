/**
 * Rutas: /api/productos
 * CRUD de productos del menú + verificar disponibilidad.
 */

const router = require('express').Router();
const Producto = require('../models/Producto');

// GET /api/productos — Listar todos (o filtrar por categoría)
router.get('/', async (req, res, next) => {
    try {
        const filtro = {};
        if (req.query.categoria) filtro.categoria = req.query.categoria;
        if (req.query.disponible !== undefined) filtro.disponible = req.query.disponible === 'true';

        const productos = await Producto.find(filtro)
            .populate('ingredientes.ingrediente', 'nombre stockActual stockMinimo')
            .sort({ categoria: 1, orden: 1 });

        res.json({ total: productos.length, productos });
    } catch (err) { next(err); }
});

// GET /api/productos/:id — Obtener uno
router.get('/:id', async (req, res, next) => {
    try {
        const producto = await Producto.findById(req.params.id)
            .populate('ingredientes.ingrediente');
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(producto);
    } catch (err) { next(err); }
});

// POST /api/productos — Crear producto
router.post('/', async (req, res, next) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json({ mensaje: '✅ Producto creado', producto });
    } catch (err) { next(err); }
});

// PUT /api/productos/:id — Actualizar producto
router.put('/:id', async (req, res, next) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: '✅ Producto actualizado', producto });
    } catch (err) { next(err); }
});

// PATCH /api/productos/:id/disponibilidad — Toggle disponibilidad
router.patch('/:id/disponibilidad', async (req, res, next) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

        producto.disponible = !producto.disponible;
        await producto.save();

        res.json({
            mensaje: producto.disponible ? '✅ Producto activado' : '⛔ Producto desactivado',
            disponible: producto.disponible
        });
    } catch (err) { next(err); }
});

// DELETE /api/productos/:id — Eliminar
router.delete('/:id', async (req, res, next) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: '🗑️ Producto eliminado' });
    } catch (err) { next(err); }
});

// GET /api/productos/check/disponibilidad — Verificar stock de ingredientes
router.get('/check/disponibilidad', async (req, res, next) => {
    try {
        const productos = await Producto.find({ disponible: true })
            .populate('ingredientes.ingrediente', 'nombre stockActual stockMinimo');

        const resultado = productos.map(p => {
            const sinStock = p.ingredientes.filter(ing => {
                return ing.ingrediente && ing.ingrediente.stockActual < ing.cantidadNecesaria;
            });
            return {
                _id: p._id,
                nombre: p.nombre,
                disponible: sinStock.length === 0,
                ingredientesFaltantes: sinStock.map(i => i.ingrediente?.nombre || 'Desconocido')
            };
        });

        res.json(resultado);
    } catch (err) { next(err); }
});

module.exports = router;
