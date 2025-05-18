const express = require('express');
const router = express.Router();
const tweetService = require('../services/tweetService');

// Analyze a tweet using GNN-FakeNews
router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Tweet text is required' });
    }

    const result = await tweetService.analyzeTweet(text);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing tweet:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get tweet history (now returns empty array)
router.get('/history', async (req, res) => {
  try {
    const tweets = await tweetService.getTweetHistory();
    res.status(200).json({ tweets });
  } catch (error) {
    console.error('Error fetching tweet history:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;