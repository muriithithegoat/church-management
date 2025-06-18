const express = require('express');
const router = express.Router();

const {
  createFamily,
  getFamilyById
} = require('../controllers/familyController');

router.post('/', createFamily);        // Create a new family
router.get('/:id', getFamilyById);     // Get one family and its members

module.exports = router;
