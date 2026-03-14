const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        const books = await Book.find(query);
        res.send(books);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).send({ error: 'Book not found' });
        res.send(book);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.createBook = async (req, res) => {
    try {
        const bookData = req.body;

        if (!bookData.title || bookData.title.trim().length < 3) {
            return res.status(400).send({ error: 'Title is required and must be at least 3 characters long.' });
        }
        if (!bookData.author || bookData.author.trim().length < 2) {
            return res.status(400).send({ error: 'Author is required and must be at least 2 characters long.' });
        }
        if (bookData.price === undefined || bookData.price <= 0) {
            return res.status(400).send({ error: 'Valid price greater than 0 is required.' });
        }
        if (!bookData.category) {
            return res.status(400).send({ error: 'Category is required.' });
        }
        if (bookData.stock !== undefined && bookData.stock < 0) {
            return res.status(400).send({ error: 'Stock cannot be negative.' });
        }

        if (req.file) {
            bookData.image = `/uploads/${req.file.filename}`;
        }
        const book = new Book(bookData);
        await book.save();
        res.status(201).send(book);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const bookData = req.body;

        if (bookData.title && bookData.title.trim().length < 3) {
            return res.status(400).send({ error: 'Title must be at least 3 characters long.' });
        }
        if (bookData.author && bookData.author.trim().length < 2) {
            return res.status(400).send({ error: 'Author must be at least 2 characters long.' });
        }
        if (bookData.price !== undefined && bookData.price <= 0) {
            return res.status(400).send({ error: 'Valid price greater than 0 is required.' });
        }
        if (bookData.stock !== undefined && bookData.stock < 0) {
            return res.status(400).send({ error: 'Stock cannot be negative.' });
        }

        if (req.file) {
            bookData.image = `/uploads/${req.file.filename}`;
        }
        const book = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true });
        if (!book) return res.status(404).send({ error: 'Book not found' });
        res.send(book);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).send({ error: 'Book not found' });
        res.send({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
