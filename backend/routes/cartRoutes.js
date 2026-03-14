const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

router.get('/', auth, cartController.getCart);
router.post('/', auth, cartController.addToCart);
router.put('/', auth, cartController.updateCartItem);
router.delete('/:bookId', auth, cartController.removeFromCart);

module.exports = router;
