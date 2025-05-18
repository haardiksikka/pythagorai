const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  isFakeNews: {
    type: Boolean,
    required: true
  },
  confidenceScore: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tweet', tweetSchema);