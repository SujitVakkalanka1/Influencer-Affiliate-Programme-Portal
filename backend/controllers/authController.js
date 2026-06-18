const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const allowedRoles = ['brand', 'influencer'];

const createToken = (user) => jwt.sign(
    {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    },
    process.env.JWT_SECRET || 'development_secret_change_me',
    { expiresIn: '1d' }
);

const cleanUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at
});

const register = async (req, res) => {
    try {
        const name = String(req.body.name || '').trim();
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');
        const requestedRole = String(req.body.role || 'influencer').trim().toLowerCase();
        const role = allowedRoles.includes(requestedRole) ? requestedRole : 'influencer';

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        const user = {
            id: result.insertId,
            name,
            email,
            role
        };

        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user
        });
    } catch (error) {
        console.error('Registration failed:', error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to register user. Please try again.'
        });
    }
};

const login = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: cleanUser(user)
        });
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Unable to log in. Please try again.'
        });
    }
};

const profile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({ success: true, user: users[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login,
    profile
};
