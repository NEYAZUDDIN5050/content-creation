const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const User = require('../models/User'); // Add this import

// @route   POST /auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signup);

// @route   POST /auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', login);

// @route   GET /auth/debug-user/:email
// @desc    Debug route to check user data (TEMPORARY - REMOVE IN PRODUCTION)
// @access  Public
router.get('/debug-user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        res.json({ 
            found: !!user,
            user: user ? {
                id: user.id,
                email: user.email,
                role: user.role,
                passwordHash: user.passwordHash ? '[HIDDEN]' : 'MISSING'
            } : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT /auth/update-role
// @desc    Update user role (TEMPORARY - REMOVE IN PRODUCTION)
// @access  Public
router.put('/update-role', async (req, res) => {
    try {
        const { email, role } = req.body;
        const user = await User.findOneAndUpdate(
            { email },
            { role },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   DELETE /auth/delete-user
// @desc    Delete user (TEMPORARY - REMOVE IN PRODUCTION)
// @access  Public
router.delete('/delete-user', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await User.findOneAndDelete({ email });
        
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ 
            success: true, 
            message: 'User deleted successfully',
            deletedUser: {
                email: result.email,
                role: result.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;