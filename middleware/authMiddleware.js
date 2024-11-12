const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;
console.log(req.headers.authorization)
    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token found:', token);

            // Decode the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);

            // Find the user by decoded ID
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                console.log('User not found with ID:', decoded.id);
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('User found:', req.user);

            // Proceed to the next middleware
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // Log if no token was provided in the header
        console.log('No token found in the request headers');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
