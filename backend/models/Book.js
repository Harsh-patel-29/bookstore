const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }, // path to the uploaded image
    stock: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
