const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Create new user
router.post('/users', async (req, res) => {
    try {
        const { username } = req.body;
        const user = new User({ username });
        await user.save();
        res.json({ username: user.username, _id: user._id });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '_id username');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;