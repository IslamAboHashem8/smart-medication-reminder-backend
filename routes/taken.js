const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Dose = require("../models/doses");
const authMiddleware = require('../middleware/auth');

router.post("/:doseId", authMiddleware, async (req, res) => {
  try {
    const { doseId } = req.params;

    if (!mongoose.isValidObjectId(doseId)) {
      return res.status(400).json({ message: "Invalid dose ID" });
    }

    const dose = await Dose.findById(doseId);

    if (!dose) {
      return res.status(404).json({ message: "Dose not found" });
    }

    // تأكد إن الـ dose بتاعت الـ user ده فعلاً
    if (dose.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (dose.taken) {
      return res.status(400).json({ message: "Dose already marked as taken" });
    }

    const now = new Date();
    const isLate = now > new Date(dose.scheduledAt);

    dose.taken = true;
    dose.takenAt = now;
    dose.missed = false;
    dose.late = isLate;

    await dose.save();

    res.json({
      message: isLate ? "Dose marked as taken (late)" : "Dose marked as taken (on time)",
      dose
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;