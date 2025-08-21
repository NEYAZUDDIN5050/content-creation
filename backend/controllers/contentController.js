const Content = require('../models/Content');

// @desc    Create new content
// @route   POST /content
// @access  Private (User)
exports.createContent = async (req, res) => {
    const { title, description } = req.body;

    try {
        const newContent = new Content({
            title,
            description,
            createdBy: req.user.id
        });

        const content = await newContent.save();
        res.status(201).json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get content list
// @route   GET /content
// @access  Private (User/Admin)
exports.getContent = async (req, res) => {
    try {
        let content;
        if (req.user.role === 'admin') {
            // Admin gets all content
            content = await Content.find().populate('createdBy', 'email');
        } else {
            // User gets only their own content
            content = await Content.find({ createdBy: req.user.id }).populate('createdBy', 'email');
        }
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Approve content
// @route   PUT /content/:id/approve
// @access  Private (Admin)
exports.approveContent = async (req, res) => {
    try {
        let content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }

        content.status = 'approved';
        await content.save();
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Reject content
// @route   PUT /content/:id/reject
// @access  Private (Admin)
exports.rejectContent = async (req, res) => {
    try {
        let content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }

        content.status = 'rejected';
        await content.save();
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get content statistics
// @route   GET /content/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
    try {
        const stats = await Content.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: '$_id',
                    count: 1
                }
            }
        ]);

        const totalSubmissions = await Content.countDocuments();

        // Format stats for easier consumption
        const formattedStats = stats.reduce((acc, curr) => {
            acc[curr.status] = curr.count;
            return acc;
        }, {});

        res.json({
            totalSubmissions,
            stats: {
                pending: formattedStats.pending || 0,
                approved: formattedStats.approved || 0,
                rejected: formattedStats.rejected || 0
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Search and filter content
// @route   GET /content/search
// @access  Private (User/Admin)
exports.searchContent = async (req, res) => {
    try {
        const { status, keyword } = req.query;
        let query = {};

        // Role-based filtering for users
        if (req.user.role === 'user') {
            query.createdBy = req.user.id;
        }

        if (status) {
            query.status = status;
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        const content = await Content.find(query).populate('createdBy', 'email');
        res.json(content);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get recent activity feed
// @route   GET /content/recent
// @access  Private (Admin)
exports.getRecentActivity = async (req, res) => {
    try {
        const recentActivity = await Content.find({
            status: { $in: ['approved', 'rejected'] }
        })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('createdBy', 'email');

        res.json(recentActivity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
