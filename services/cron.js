const cron = require("node-cron");
const Dose = require("../models/doses");
const Notification = require("../models/notification");

// كل دقيقة
cron.schedule("*/1 * * * *", async () => {
  console.log("Cron running...");

  const now = new Date();

  // هات الجرعات اللي وقتها فات ومش متاخدة
  const dueDoses = await Dose.find({
    taken: false,
    scheduledAt: { $lte: now }
  });

  for (const dose of dueDoses) {

    // ✅ الإصلاح: تأكد إن التنبيه مش موجود قبل ما تعمله
    const alreadyNotified = await Notification.findOne({ doseId: dose._id });

    if (!alreadyNotified) {
      await Notification.create({
        userId: dose.userId,
        doseId: dose._id,
        message: `It's time to take ${dose.medicineName}!`,
        seen: false
      });

      console.log(`Notification created for dose: ${dose.medicineName}`);
    }
  }
});