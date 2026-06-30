// const express = require('express');
// const router = express.Router();
// const Dose = require('../models/doses');

// // POST /api/taken/:doseId
// router.post('/:doseId', async (req, res) => {
//     try {
//         const { doseId } = req.params;

//         const dose = await Dose.findById(doseId);
//         if (!dose) return res.status(404).json({ message: "Dose not found" });

//         // Check إذا الجرعة متأخرة
//         const now = new Date();
//         const isLate = now > dose.scheduledAt;

//         dose.taken = true;
//         dose.takenAt = now;
//         dose.missed = isLate ? true : false;

//         await dose.save();

//         res.json({
//             message: "Dose updated successfully",
//             dose
//         });

//     } catch (err) {
//         res.status(500).json({ message: "Server error", error: err });
//     }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Dose = require("../models/doses");

router.post("/:doseId", async (req, res) => {
  try {
    const { doseId } = req.params;

    // ✅ تأكد إن الـ ID صح قبل ما تروح للـ DB
    if (!mongoose.isValidObjectId(doseId)) {
      return res.status(400).json({ message: "Invalid dose ID" });
    }

    const dose = await Dose.findById(doseId);

    if (!dose) {
      return res.status(404).json({ message: "Dose not found" });
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