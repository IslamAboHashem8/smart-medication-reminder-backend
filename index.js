const express = require('express');
const mongoose = require('mongoose');
const takenRoute = require('./routes/taken');
const predictRoute = require('./routes/predict');
const drugAlternatives =require('./routes/drugAlternatives')
const router = express.Router();
const Notification = require('./models/notification');
const notificationRoutes = require('./routes/notifications');
const dosesRoute = require('./routes/doses');
// رجّع كل الـ notifications اللي مش مقروءة
router.get('/', async (req, res) => {
    const notifications = await Notification.find({ seen: false });

    res.json({ notifications });
});

module.exports = router;

require('dotenv').config();
// console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
const app = express();
require('./service/cron')
const uploadRoute = require('./routes/upload');
app.use(express.json());

app.use('/api/taken', takenRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/notifications', notificationRoutes);
app.use('/api/predict',require('./routes/predict'));
app.use('/api/drugAlternatives', require('./routes/drugAlternatives'));
app.use('/api/doses', dosesRoute);

// Global Error Handler
app.use((err, req, res, next) => {

    if (err.message === "Only JPG, JPEG and PNG images are allowed.") {

        return res.status(400).json({
            message: err.message
        });

    }

    if (err.code === "LIMIT_FILE_SIZE") {

        return res.status(400).json({
            message: "Maximum file size is 5MB."
        });

    }

    return res.status(500).json({
        message: err.message
    });

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
