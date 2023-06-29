const mongoose = require('mongoose');

const SymbolValueSchema = new mongoose.Schema({
    symbol: String,
    value: Number,
    createdAt: Date
});

const SymbolValue = mongoose.model('symbolValue', SymbolValueSchema);

module.exports = SymbolValue;