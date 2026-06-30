// const express = require('express');
// const router = express.Router();

// const Dose = require('../models/doses');

// // GET /doses
// router.get('/', async (req, res) => {
//     try {

//         const doses = await Dose.find().limit(50);

//         res.status(200).json({
//             count: doses.length,
//             doses
//         });

//     } catch (error) {

//         res.status(500).json({
//             message: error.message
//         });

//     }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Dose = require("../models/doses");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const userId = req.query.userId;

    const filter = userId ? { userId } : {};

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

// DELETE — مسح كل الجرعات (للتجربة أو البداية من أول)
router.delete("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const filter = userId ? { userId } : {};

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