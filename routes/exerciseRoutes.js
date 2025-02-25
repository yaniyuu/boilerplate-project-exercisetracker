const express = require('express');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

const router = express.Router();

// Add an exercise
router.post('/users/:_id/exercises', async (req, res) => {
    try {
        const { _id } = req.params;
        const { description, duration, date } = req.body;
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const exercise = new Exercise({
            userId: _id,
            description,
            duration: Number(duration),
            date: date ? new Date(date) : new Date()
        });
        await exercise.save();
        
        res.json({
            _id: user._id,
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString()
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// Get exercise logs
// Get exercise logs with optional query parameters
router.get('/users/:_id/logs', async (req, res) => {
    try {
        const { _id } = req.params;
        const { from, to, limit } = req.query;

        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        let query = { userId: _id };

        // Filter by date range if provided
        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = new Date(from);
            if (to) query.date.$lte = new Date(to);
        }

        // Fetch exercises, apply sorting, and limit
        let exercises = await Exercise.find(query)
            .sort({ date: 1 }) // Sort by date ascending
            .limit(Number(limit) || 0); // Apply limit if provided

        res.json({
            _id: user._id,
            username: user.username,
            count: exercises.length,
            log: exercises.map(ex => ({
                description: ex.description,
                duration: ex.duration,
                date: ex.date.toDateString()
            }))
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
