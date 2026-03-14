const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || name.trim().length < 3) {
            return res.status(400).send({ error: 'Name must be at least 3 characters long.' });
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email || !emailPattern.test(email)) {
             return res.status(400).send({ error: 'Valid email is required.' });
        }
        if (!password || password.length < 6) {
             return res.status(400).send({ error: 'Password must be at least 6 characters long.' });
        }

        // Force role to be 'user' for all registrations to prevent security exploit
        const user = new User({ name, email, password, role: 'user' });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).send({ error: `A user with this ${field} already exists.` });
        }
        res.status(400).send({ error: error.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).send({ error: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).send({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ error: 'Invalid login credentials' });
        }
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET || 'secretkey');
        res.send({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
