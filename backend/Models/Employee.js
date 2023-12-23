const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    balanceTony: Number
})

module.exports = mongoose.model('Emp', empSchema);