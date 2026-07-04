const express = require("express");
const router = express.Router();
const Dose = require("../models/doses");
const authMiddleware = require('../middleware/auth');

router.get("/", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const filter = { userId: req.user._id };

    const [doses, totalCount] = await Promise.all([
      Dose.find(filter).sort({ scheduledAt: 1 }).skip(skip).limit(limit),
      Dose.countDocuments(filter)
    ]);

    res.json({
      doses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    const result = await Dose.deleteMany(filter);

    res.json({
      message: "Doses deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;