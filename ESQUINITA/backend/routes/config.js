const router = require('express').Router();
const Config = require('../models/Config');

async function obtenerConfiguracion() {
    let config = await Config.findOne();
    if (!config) {
        config = await Config.create({});
    }
    return config;
}

// GET /api/config
router.get('/', async (req, res, next) => {
    try {
        const config = await obtenerConfiguracion();
        res.json({
            deliveryEnabled: config.deliveryEnabled,
            deliveryZone: config.deliveryZone,
            deliveryFeeRenca: config.deliveryFeeRenca
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
