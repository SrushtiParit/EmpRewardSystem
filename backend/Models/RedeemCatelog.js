const mongoose = require('mongoose');

const redeemSchema = new mongoose.Schema({
    name: String,
    tonies: Number,
    product: String,
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Redeem', redeemSchema);