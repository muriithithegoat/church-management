const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '7d' }
  );
};

// ✅ Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);
    res.status(201).json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ user: { name: user.name, email: user.email }, token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// ✅ Forgot password - Send email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If this email exists, a reset link was sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '10m' });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,      // your Gmail
        pass: process.env.EMAIL_PASS       // your App Password
      }
    });

    await transporter.sendMail({
      from: `"Church App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the button below:</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background-color:#28a745;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `
    });

    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Failed to send reset email' });
  }
});

// ✅ Reset password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
