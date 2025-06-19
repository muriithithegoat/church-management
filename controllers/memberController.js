const Member = require("../models/Member");

// Add a new member
exports.addMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error("Add Member Error:", error);
    res.status(500).json({ message: "Failed to add member" });
  }
};

// Get all members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    console.error("Get Members Error:", error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// Get single member by ID
exports.getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error("Get Member Error:", error);
    res.status(500).json({ message: "Failed to fetch member" });
  }
};

// Update a member
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    baptismDate,
    matrimony,
    familyId,
  } = req.body;

  try {
    const updatedData = {
      fullName,
      baptismDate,
      matrimony,
      familyId,
    };

    const updatedMember = await Member.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Update Member Error:", error);
    res.status(500).json({ message: "Failed to update member" });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Delete Member Error:", error);
    res.status(500).json({ message: "Failed to delete member" });
  }
};
