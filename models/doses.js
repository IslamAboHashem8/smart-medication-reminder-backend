// 
const mongoose = require("mongoose");

const doseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  taken: {
    type: Boolean,
    default: false
  },
  takenAt: {
    type: Date,
    default: null
  },
  // ✅ الإصلاح: إضافة حقل missed اللي كان موجود في الكود بس مش في الـ Schema
  missed: {
    type: Boolean,
    default: false
  },
  late: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Dose", doseSchema);