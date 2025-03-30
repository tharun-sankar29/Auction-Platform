const express = require('express');
const router = express.Router();
const { User } = require('./schema/schema');

// ✅ LOGIN Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const FoundUser = await User.findOne({ email, password });

        if (FoundUser) {
            console.log('New user has been logged in...');
            console.log('UID: ' + FoundUser._id);

            req.session.user_id = FoundUser._id;  // ✅ Store user_id in session

            res.status(200).json({ message: 'Login successful!.. Redirecting to dashboard...' });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Server Error..' });
    }
});

// ✅ REGISTER Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists, Please Login...' });
        }

        const newUser = await User.create({ name, email, password });

        req.session.user_id = newUser._id;  // ✅ Store user_id in session

        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Something went wrong, please try again later...' });
    }
});

// ✅ LOGOUT Route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({ message: "Logged out successfully" });
    });
});

// ✅ Corrected Session Retrieval Route
router.get('/session', (req, res) => {
    if (req.session.user_id) {  // ✅ Correctly check for user_id in session
        res.json({ user_id: req.session.user_id });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

module.exports = router;
