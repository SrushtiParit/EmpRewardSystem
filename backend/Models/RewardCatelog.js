const mongoose = require('mongoose');

const Rewards = new mongoose.Schema({
    name: String,
    reason: String,
    initialTony:Number,
    tonies: Number,
    date: { type: Date, default: Date.now },
    status: String
})
module.exports = mongoose.model('RewardCatelog', Rewards);
