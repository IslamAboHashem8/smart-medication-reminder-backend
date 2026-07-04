const express = require('express');
const router = express.Router();
const Dose = require('../models/doses');
const upload = require('../middleware/multer');
const authMiddleware = require('../middleware/auth');
const { runOCR } = require('../services/ocrService');
const { matchMedicines } = require('../services/medicineMatcher');

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log("================================");
        console.log("Upload Started");
        console.log("Image:", req.file.filename);
        console.log("================================");

        console.log("Running EasyOCR...");
        const extractedTexts = await runOCR(req.file.path);
        console.log("EasyOCR Completed");
        console.log("Extracted texts:", extractedTexts);

        const medicines = await matchMedicines(extractedTexts);
        console.log(`Medicines Found: ${medicines.length}`);
        medicines.forEach((m, index) => {
            console.log(`${index + 1}. ${m.drug_name}`);
        });

        if (!medicines.length) {
            return res.status(400).json({
                message: "No medicines found in OCR result"
            });
        }

        const allDoses = [];
        const userId = req.user._id;

        medicines.forEach(med => {
            const name = med.drug_name;
            const doses = ['08:00', '20:00'];
            const durationDays = 4;

            for (let day = 0; day < durationDays; day++) {
                doses.forEach(time => {
                    const [hour, minute] = time.split(":");
                    const scheduledAt = new Date();
                    scheduledAt.setDate(scheduledAt.getDate() + day);
                    scheduledAt.setHours(hour, minute, 0, 0);

                    allDoses.push({
                        userId,
                        medicineName: name,
                        scheduledAt,
                        taken: false
                    });
                });
            }
        });

        console.log(`Generated Doses: ${allDoses.length}`);
        console.log("Saving doses...");

        const savedDoses = await Dose.insertMany(allDoses);

        console.log("Upload Completed Successfully");
        console.log("================================");

        res.status(200).json({
            message: "Image uploaded successfully",
            medicinesFound: medicines.length,
            medicines: medicines.map(m => m.drug_name),
            totalGeneratedDoses: savedDoses.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
});

module.exports = router;