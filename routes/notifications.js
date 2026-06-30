// const express = require('express');
// const router = express.Router();

// const Notification = require('../models/notification');

// // رجّع كل الـ notifications اللي مش مقروءة
// router.get('/', async (req, res) => {
//     const notifications = await Notification.find({ seen: false });

//     res.json({ notifications });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");

// GET — هات كل التنبيهات
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ notifications });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ PATCH — علّم التنبيه كـ seen
router.patch("/:id/seen", async (req, res) => {
  try {
    const { id } = req.params;

    if (!require("mongoose").isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid notification ID" });
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
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