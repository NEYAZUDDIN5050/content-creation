const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware.js');
const {
    createContent,
    getContent,
    approveContent,
    rejectContent,
    getStats,
    searchContent,
    getRecentActivity
} = require('../controllers/contentController');

// @route   GET /content/stats
// @desc    Get content statistics
// @access  Private (Admin)
router.get('/stats', protect, authorize('admin'), getStats);

// @route   GET /content/search
// @desc    Search and filter content
// @access  Private (User/Admin)
router.get('/search', protect, authorize('user', 'admin'), searchContent);

// @route   GET /content/recent
// @desc    Get recent activity feed
// @access  Private (Admin)
router.get('/recent', protect, authorize('admin'), getRecentActivity);

// @route   POST /content
// @desc    Create new content
// @access  Private (User/Admin)
router.post('/', protect, authorize('user', 'admin'), createContent);

// @route   GET /content
// @desc    Get content (all for admin, own for user)
// @access  Private (User/Admin)
router.get('/', protect, authorize('user', 'admin'), getContent);

// @route   PUT /content/:id/approve
// @desc    Approve content
// @access  Private (Admin)
router.put('/:id/approve', protect, authorize('admin'), approveContent);

// @route   PUT /content/:id/reject
// @desc    Reject content
// @access  Private (Admin)
router.put('/:id/reject', protect, authorize('admin'), rejectContent);

module.exports = router;
