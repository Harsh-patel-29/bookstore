const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, default: 1, min: [1, 'Quantity must be at least 1'] }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
