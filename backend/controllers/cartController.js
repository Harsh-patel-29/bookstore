const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        if (quantity <= 0) {
            return res.status(400).send({ error: 'Quantity must be greater than 0' });
        }
        let cart = await Cart.findOne({ userId: req.user._id });
        
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [{ bookId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(p => p.bookId.toString() === bookId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ bookId, quantity });
            }
        }
        await cart.save();
        res.status(200).send(cart);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
        res.send(cart || { items: [] });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });
        const itemIndex = cart.items.findIndex(p => p.bookId.toString() === bookId);
        
        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
            await cart.save();
            res.send(cart);
        } else {
            res.status(404).send({ error: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.params;
        const cart = await Cart.findOne({ userId: req.user._id });
        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
        await cart.save();
        res.send(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
