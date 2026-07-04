const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Notification = require("../models/notification");
const authMiddleware = require('../middleware/auth');

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/:id/seen", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { seen: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Marked as seen", notification });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;