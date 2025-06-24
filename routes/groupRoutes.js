// routes/groupRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Group = require('../models/group');

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all groups
router.get('/', authenticate, async (req, res) => {
  const groups = await Group.find({ userId: req.userId });
  res.json(groups);
});

// Create new group
router.post('/', authenticate, async (req, res) => {
  const { name } = req.body;
  const group = new Group({ name, userId: req.userId });
  await group.save();
  res.status(201).json(group);
});

// Delete a group
router.delete('/:id', authenticate, async (req, res) => {
  const deleted = await Group.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!deleted) return res.status(404).json({ message: 'Group not found' });
  res.json({ message: 'Group deleted' });
});

module.exports = router;
