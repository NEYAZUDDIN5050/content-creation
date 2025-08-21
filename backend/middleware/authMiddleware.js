const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - checks JWT and attaches user to req
exports.protect = async (req, res, next) => {
    let token;

    // Check if Authorization header with Bearer token exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token, exclude password hash
            req.user = await User.findById(decoded.user.id).select('-passwordHash');

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    // If no token found
    if (!token) {
        return res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// Authorize roles - use as authorize('admin'), authorize('user', 'admin'), etc.
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Not authorized for this route' });
        }
        next();
    };
};
