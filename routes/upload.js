const express = require('express');
const router = express.Router();
const Dose = require('../models/doses');
const mongoose = require('mongoose');
const upload = require('../middleware/multer');
const path = require('path');
const { readCSV } = require('../services/csvService');
const { runOCR } = require('../services/ocrService');
const { matchMedicines } = require('../services/medicineMatcher');
// const fs = require("fs");
// ==============================
// Mock OCR (من CSV)
// ==============================
async function OCRFromCSV() {
    const data = await readCSV(
        path.join(__dirname, '../data/medicines_full.csv')
    );

  
      return {
        medicines: data.slice(0,3).map(item => ({
           name: item.drug_name,
           activeIngredient: item.active_ingredient,
           uses: item.Uses,
           doses: ['08:00', '20:00'],
           durationDays: 5 ,
            
           }))
};
}


// userId مؤقت
const DEMO_USER_ID = new mongoose.Types.ObjectId();

// ==============================
// Upload Route
// ==============================
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // ✅ تشغيل الفنكشن صح
        const extractedText =
        await runOCR(req.file.path);
        // console.log("OCR RESULT:");
        // console.log(extractedText);
         console.log("================================");
         console.log("Upload Started");
         console.log("Image:", req.file.filename);
         console.log("================================");

         console.log("Running EasyOCR...");
         console.log("EasyOCR Completed");

        const medicines =
            await matchMedicines(extractedText);
            console.log(`Medicines Found: ${medicines.length}`);
            console.log("Matched Medicines:");
            medicines.forEach((m, index) => {
                console.log(`${index + 1}. ${m.drug_name}`);
            });
            
        // if (fs.existsSync(req.file.path)) {
        //      fs.unlinkSync(req.file.path);
        // }


        if (!medicines.length) {
            return res.status(400).json({
                message: "No medicines found in OCR result"
            });
        }

        const allDoses = [];

        // ==============================
        // Generate doses
        // ==============================
        medicines.forEach(med => {

    const name = med.drug_name;

    const doses = ['08:00', '20:00'];

    const durationDays = 4;

    for (let day = 0; day < durationDays; day++) {

        doses.forEach(time => {

            const [hour, minute] = time.split(":");

            const scheduledAt = new Date();

            scheduledAt.setDate(
                scheduledAt.getDate() + day
            );

            scheduledAt.setHours(
                hour,
                minute,
                0,
                0
            );

            allDoses.push({
                userId: DEMO_USER_ID,
                medicineName: name,
                scheduledAt,
                taken: false
            });

        });

    }

});
        // ==============================
        // Save to DB
        // ==============================
        console.log(`Generated Doses: ${allDoses.length}`);
        console.log("Saving doses...");
        
        const savedDoses = await Dose.insertMany(allDoses);

        console.log("Upload Completed Successfully");
        console.log("================================");

        res.status(200).json({
            message : "Image uploaded successfully",
            medicinesFound : medicines.length,
            medicines :medicines.map(m => m.drug_name),
            totalGeneratedDoses : savedDoses.length
             //file : req.file.filename,
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
