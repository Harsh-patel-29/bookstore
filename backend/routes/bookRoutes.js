const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bookController = require('../controllers/bookController');
const { auth, admin } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', auth, admin, upload.single('image'), bookController.createBook);
router.put('/:id', auth, admin, upload.single('image'), bookController.updateBook);
router.delete('/:id', auth, admin, bookController.deleteBook);

module.exports = router;
