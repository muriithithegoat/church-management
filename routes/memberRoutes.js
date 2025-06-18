const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  addMember,
  getAllMembers,
  getMemberById
} = require('../controllers/memberController');

// Routes
router.post('/', addMember);            // Add a new member
router.get('/', getAllMembers);         // Get all members
router.get('/:id', getMemberById);      // Get one member by ID

module.exports = router;
