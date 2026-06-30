const Dose = require('../models/doses');
async function predictForget(userId, doseId) {

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // هات كل الجرعات اللي المفروض اتاخدت في آخر 7 أيام
  const pastDoses = await Dose.find({
    userId,
    scheduledAt: { $gte: sevenDaysAgo, $lte: new Date() }
  });

  if (pastDoses.length === 0) {
    return { willForget: false, confidence: "0.50", reason: "No history available" };
  }

  // احسب كام جرعة اتنسيت
  const missedDoses = pastDoses.filter(d => !d.taken);
  const missedRate = missedDoses.length / pastDoses.length;

  // لو نسبة النسيان أكتر من 40% → هينسى
  const willForget = missedRate > 0.4;

  return {
    willForget,
    confidence: missedRate.toFixed(2),
    totalDoses: pastDoses.length,
    missedDoses: missedDoses.length,
    reason: willForget
      ? "High missed dose rate in the last 7 days"
      : "Good adherence in the last 7 days"
  };
}

module.exports = { predictForget };