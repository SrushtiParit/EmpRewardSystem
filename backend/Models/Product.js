const mongoose = require('mongoose');

const Product = new mongoose.Schema({
    name: String,
    tony: Number,
    date: { type: Date, default: Date.now },
})
module.exports = mongoose.model('Product', Product);