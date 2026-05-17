const router = require('express').Router();
const Pedido = require('../models/Pedido');
const Ingrediente = require('../models/Ingrediente');
const Admin = require('../models/Admin');
const Config = require('../models/Config');
const { verificarToken } = require('../middleware/auth');

async function obtenerConfiguracion() {
    let config = await Config.findOne();
    if (!config) config = await Config.create({});
    return config;
}

router.use(verificarToken);

router.get('/dashboard', async (req, res, next) => {
    try {
        const hoy = new Date(); hoy.setHours(0,0,0,0);
        const manana = new Date(hoy); manana.setDate(manana.getDate()+1);
        const hace7 = new Date(hoy); hace7.setDate(hace7.getDate()-6);
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

        const pedidosHoy = await Pedido.find({ createdAt:{$gte:hoy,$lt:manana}, estado:{$ne:'cancelado'} });
        const ventasHoy = pedidosHoy.reduce((s,p)=>s+p.total,0);
        const ticketPromedio = pedidosHoy.length>0 ? Math.round(ventasHoy/pedidosHoy.length) : 0;

        const ventasSemana = await Pedido.aggregate([
            { $match: { createdAt:{$gte:hace7,$lt:manana}, estado:{$ne:'cancelado'} } },
            { $group: { _id:{$dateToString:{format:'%Y-%m-%d',date:'$createdAt'}}, total:{$sum:'$total'}, cantidad:{$sum:1} } },
            { $sort: { _id:1 } }
        ]);

        const ventasMesD = await Pedido.aggregate([
            { $match: { createdAt:{$gte:inicioMes,$lt:manana}, estado:{$ne:'cancelado'} } },
            { $group: { _id:null, total:{$sum:'$total'}, cantidad:{$sum:1} } }
        ]);
        const ventasMes = ventasMesD[0] || {total:0,cantidad:0};

        const topProductos = await Pedido.aggregate([
            { $match: { createdAt:{$gte:inicioMes}, estado:{$ne:'cancelado'} } },
            { $unwind: '$productos' },
            { $group: { _id:'$productos.nombre', cantidad:{$sum:'$productos.cantidad'}, ingresos:{$sum:{$multiply:['$productos.precio','$productos.cantidad']}} } },
            { $sort: { cantidad:-1 } }, { $limit: 5 }
        ]);

        const porMetodoPago = await Pedido.aggregate([
            { $match: { createdAt:{$gte:hoy,$lt:manana}, estado:{$ne:'cancelado'} } },
            { $group: { _id:'$metodoPago', cantidad:{$sum:1}, total:{$sum:'$total'} } }
        ]);

        const pedidosRecientes = await Pedido.find().sort({createdAt:-1}).limit(50);
        const ingredientes = await Ingrediente.find({activo:true});
        const alertasDetalle = ingredientes.filter(i=>i.stockActual<=i.stockMinimo);
        const usuarios = await Admin.find().select('-password').sort({rol:1,nombre:1});
        const config = await obtenerConfiguracion();

        res.json({
            ventasHoy, pedidosHoy:pedidosHoy.length, ticketPromedio,
            ventasSemana, ventasMes, topProductos, porMetodoPago,
            pedidosPendientes: await Pedido.countDocuments({estado:'pendiente'}),
            alertasStock:alertasDetalle.length, alertasDetalle,
            pedidosRecientes, usuarios,
            deliveryConfig: {
                deliveryEnabled: config.deliveryEnabled,
                deliveryZone: config.deliveryZone,
                deliveryFeeRenca: config.deliveryFeeRenca
            }
        });
    } catch(e) { next(e); }
});

router.get('/usuarios', async (req, res, next) => {
    try {
        const usuarios = await Admin.find().select('-password').sort({rol:1,nombre:1});
        res.json({ total: usuarios.length, usuarios });
    } catch(e) { next(e); }
});

router.patch('/pedido/:id/estado', async (req, res, next) => {
    try {
        const { estado } = req.body;
        const validos = ['pendiente','confirmado','preparando','en_camino','entregado','cancelado'];
        if (!validos.includes(estado)) return res.status(400).json({error:'Estado invalido'});
        const pedido = await Pedido.findByIdAndUpdate(req.params.id, {estado}, {new:true});
        if (!pedido) return res.status(404).json({error:'No encontrado'});
        res.json({ mensaje:'Pedido actualizado', pedido });
    } catch(e) { next(e); }
});

router.get('/config', async (req, res, next) => {
    try {
        const config = await obtenerConfiguracion();
        res.json({
            deliveryEnabled: config.deliveryEnabled,
            deliveryZone: config.deliveryZone,
            deliveryFeeRenca: config.deliveryFeeRenca
        });
    } catch (e) { next(e); }
});

router.patch('/config', async (req, res, next) => {
    try {
        const { deliveryEnabled, deliveryFeeRenca } = req.body;
        const config = await obtenerConfiguracion();
        if (typeof deliveryEnabled === 'boolean') config.deliveryEnabled = deliveryEnabled;
        if (deliveryFeeRenca !== undefined) {
            const fee = Number(deliveryFeeRenca);
            if (Number.isNaN(fee) || fee < 0) return res.status(400).json({ error: 'Tarifa de delivery inválida' });
            config.deliveryFeeRenca = fee;
        }
        await config.save();
        res.json({
            mensaje: 'Configuración actualizada',
            deliveryEnabled: config.deliveryEnabled,
            deliveryZone: config.deliveryZone,
            deliveryFeeRenca: config.deliveryFeeRenca
        });
    } catch (e) { next(e); }
});

module.exports = router;
