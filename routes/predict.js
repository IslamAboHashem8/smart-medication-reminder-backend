const express = require('express');
const router = express.Router();
const { predictForget } = require('../services/predictionservice');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await predictForget(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;