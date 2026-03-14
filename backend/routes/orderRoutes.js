const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, admin } = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getOrders);
router.get('/all', auth, admin, orderController.getAllOrders);
router.put('/status', auth, admin, orderController.updateOrderStatus);

module.exports = router;
