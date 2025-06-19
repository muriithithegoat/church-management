const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

// Add a new member
router.post("/members", memberController.addMember);

// Get all members
router.get("/members", memberController.getMembers);

// Get a specific member by ID
router.get("/members/:id", memberController.getMember);

// Update a member by ID
router.put("/members/:id", memberController.updateMember);

// Delete a member by ID
router.delete("/members/:id", memberController.deleteMember);

module.exports = router;
