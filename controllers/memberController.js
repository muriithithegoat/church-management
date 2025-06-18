const Member = require('../models/member');

// Add a new member
const addMember = async (req, res) => {
  try {
    const member = new Member(req.body);
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all members
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate('familyId') // We'll define this in the model
      .populate('matrimony.spouseId'); // Optional spouse info
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single member by ID
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('familyId')
      .populate('matrimony.spouseId');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMember,
  getAllMembers,
  getMemberById
};
