const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// ✅ Get all members
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find().populate('matrimony.spouseId', 'fullName');
    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Failed to fetch members' });
  }
});

// ✅ Add new member
router.post('/members', async (req, res) => {
  try {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(400).json({ message: 'Failed to add member' });
  }
});

// ✅ Get single member by ID
router.get('/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('matrimony.spouseId', 'fullName');
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
router.put('/members/:id', async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
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
router.delete('/members/:id', async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ message: 'Failed to delete member' });
  }
});

// ✅ Stats Route
router.get('/members/stats', async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const marriedMembers = await Member.countDocuments({ 'matrimony.isMarried': true });
    const baptizedMembers = await Member.countDocuments({ baptismDate: { $ne: null } });

    const spouseIds = await Member.distinct('matrimony.spouseId', {
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
