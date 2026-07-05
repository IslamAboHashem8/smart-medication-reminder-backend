require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/upload", require("./routes/upload"));
app.use("/api/doses", require("./routes/doses"));
app.use("/api/taken", require("./routes/taken"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/predict", require("./routes/predict"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/drugAlternatives", require("./routes/drugAlternatives"));

// ✅ Health Check
app.get("/api/health", async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.json({
      status: "ok",
      database: dbStatus,
      uptime: `${Math.floor(process.uptime())} seconds`
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    require("./services/cron"); // ✅ بعد ما الداتابيز توصل، وبفولدر "services" الصح
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });