const express = require('express');
const router = express.Router();
const {
  getMembers,
  addMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');

router.get('/', getMembers); // /api/members
router.post('/', addMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

module.exports = router;
