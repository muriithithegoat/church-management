const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  familyName: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Family = mongoose.model('Family', familySchema);

module.exports = Family;
