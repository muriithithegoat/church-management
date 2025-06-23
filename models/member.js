const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date
  },
  baptismDate: {
    type: Date
  },
  matrimony: {
    isMarried: {
      type: Boolean,
      default: false
    },
    spouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null
    },
    marriageDate: {
      type: Date,
      default: null
    }
  },
  groups: {
    type: [String],
    default: [] // allows multiple custom groups like ['Youth', 'SCC Alpha']
  },
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Multi-tenancy support
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
