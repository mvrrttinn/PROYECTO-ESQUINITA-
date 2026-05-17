const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    deliveryEnabled: { type: Boolean, default: true },
    deliveryZone: { type: String, default: 'Renca' },
    deliveryFeeRenca: { type: Number, default: 2000, min: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Config', configSchema);
