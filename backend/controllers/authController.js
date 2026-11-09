const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// User Registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please fill all fields'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: 'Registration successful',
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Please enter email and password'
            });
        }

        const user = await User.findOne({ email });

        if (user && await user.comparePassword(password)) {
            return res.status(200).json({
                message: 'Login successful',
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }

        res.status(401).json({
            message: 'Invalid email or password'
        });

    } catch (error) {
    console.error('Registration Error:', error);

    res.status(500).json({
        message: error.message
    });
}
};

module.exports = { registerUser, loginUser };