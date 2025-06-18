const Family = require('../models/Family');

const createFamily = async (req, res) => {
  try {
    const { familyName, members } = req.body;

    const newFamily = new Family({
      familyName,
      members
    });

    const savedFamily = await newFamily.save();
    res.status(201).json(savedFamily);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFamilyById = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id).populate('members');

    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    res.status(200).json(family);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFamily,
  getFamilyById
};
