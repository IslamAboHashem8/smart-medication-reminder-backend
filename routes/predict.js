const express = require('express');
const router = express.Router();
const { predictForget } = require('../services/predictionservice');

router.post('/', async (req, res) => {
  try {
    const { userId, doseId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const result = await predictForget(userId, doseId);
    res.json(result);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;