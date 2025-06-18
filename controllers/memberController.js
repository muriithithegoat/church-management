import Member from '../models/Member.js';

// 👉 Create a new member
const addMember = async (req, res) => {
  try {
    const newMember = await Member.create(req.body);
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 👉 Get all members
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().populate('familyId').populate('matrimony.spouseId');
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👉 Get a single member by ID
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('familyId').populate('matrimony.spouseId');
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addMember,
  getAllMembers,
  getMemberById
};
