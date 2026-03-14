const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, admin } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.get('/users', auth, admin, authController.getAllUsers);
router.put('/update-role', auth, admin, authController.updateUserRole);

module.exports = router;
