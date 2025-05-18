const express = require('express');
const router = express.Router();
const tweetRoutes = require('./tweetRoutes');

// Root path response
router.get("/", (req, res) => {
  res.status(200).send("Welcome to Your Website!");
});

router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Tweet routes
router.use('/api/tweets', tweetRoutes);

module.exports = router;