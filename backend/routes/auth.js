const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = process.env;

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const user = new User(req.body);
    await user.save();
    console.log('User created:', user);
    const { username, email, password } = req.body;
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username, email } });
  } catch (err) {
     console.error('Registration error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;