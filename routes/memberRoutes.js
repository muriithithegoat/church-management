const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Member = require('../models/member');

// ✅ Middleware to extract user ID from JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Get all members for this user
router.get('/', authenticate, async (req, res) => {
  try {
    const members = await Member.find({ userId: req.userId }).populate('matrimony.spouseId', 'fullName');
    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Failed to fetch members' });
  }
});

// ✅ Add new member (with DOB & groups)
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      fullName,
      baptismDate,
      dateOfBirth,
      matrimony,
      familyId,
      groups
    } = req.body;

    const newMember = new Member({
      fullName,
      baptismDate,
      dateOfBirth,
      matrimony: {
        isMarried: matrimony?.isMarried || false,
        spouseId: matrimony?.spouseId || null,
        marriageDate: matrimony?.marriageDate || null
      },
      familyId: familyId || null,
      groups: Array.isArray(groups) ? groups : [],
      userId: req.userId
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(400).json({ message: 'Failed to add member' });
  }
});

// ✅ Get single member by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const member = await Member.findOne({ _id: req.params.id, userId: req.userId })
      .populate('matrimony.spouseId', 'fullName');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    console.error('Error fetching member:', err);
    res.status(500).json({ message: 'Failed to fetch member' });
  }
});

// ✅ Update member
router.put('/:id', authenticate, async (req, res) => {
  try {
    const {
      fullName,
      baptismDate,
      dateOfBirth,
      matrimony,
      familyId,
      groups
    } = req.body;

    const updatedMember = await Member.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        fullName,
        baptismDate,
        dateOfBirth,
        matrimony: {
          isMarried: matrimony?.isMarried || false,
          spouseId: matrimony?.spouseId || null,
          marriageDate: matrimony?.marriageDate || null
        },
        familyId: familyId || null,
        groups: Array.isArray(groups) ? groups : []
      },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(updatedMember);
  } catch (err) {
    console.error('Error updating member:', err);
    res.status(400).json({ message: 'Failed to update member' });
  }
});

// ✅ Delete member
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Member.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ message: 'Failed to delete member' });
  }
});

// ✅ Stats route for current user
router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments({ userId: req.userId });
    const marriedMembers = await Member.countDocuments({ userId: req.userId, 'matrimony.isMarried': true });
    const baptizedMembers = await Member.countDocuments({ userId: req.userId, baptismDate: { $ne: null } });

    const spouseIds = await Member.distinct('matrimony.spouseId', {
      userId: req.userId,
      'matrimony.spouseId': { $ne: null }
    });

    const familyCount = spouseIds.length;

    res.json({
      totalMembers,
      marriedMembers,
      baptizedMembers,
      familyCount
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;
