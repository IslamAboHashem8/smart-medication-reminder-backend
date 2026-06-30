const express = require("express");
const router = express.Router();
const Dose = require("../models/doses");

router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const filter = userId ? { userId } : {};

    const [totalDoses, takenDoses, lateDoses, missedDoses] = await Promise.all([
      Dose.countDocuments(filter),
      Dose.countDocuments({ ...filter, taken: true }),
      Dose.countDocuments({ ...filter, late: true }),
      Dose.countDocuments({ ...filter, taken: false, scheduledAt: { $lte: new Date() } })
    ]);

    const adherenceRate = totalDoses > 0
      ? ((takenDoses / totalDoses) * 100).toFixed(1)
      : "0.0";

    res.json({
      totalDoses,
      takenDoses,
      missedDoses,
      lateDoses,
      adherenceRate: `${adherenceRate}%`,
      summary: adherenceRate >= 80
        ? "Good adherence 👍"
        : adherenceRate >= 50
        ? "Moderate adherence ⚠️"
        : "Poor adherence ❌"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;