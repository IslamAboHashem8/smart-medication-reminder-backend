Smart Medication Reminder System (EasyOCR Version)

Overview

This project is a backend system for a Smart Medication Reminder application. It allows users to upload a prescription image, extract medication names using EasyOCR, generate medication schedules, track taken doses, and receive notifications.

Features

* Upload prescription images
* Extract medicine names using EasyOCR
* Match medicines with dataset records
* Generate medication schedules automatically
* Track taken doses
* View notifications
* Predict medication adherence
* View alternative medications

Technologies Used

* Node.js
* Express.js
* MongoDB
* Python 3.11
* EasyOCR
* CSV Dataset

API Endpoints

Upload Prescription

POST /api/upload

Get Doses

GET /api/doses

Mark Dose as Taken

POST /api/taken/:id

Get Notifications

GET /api/notifications

Predict Adherence

POST /api/predict

Get Drug Alternatives

GET /api/drugAlternatives

Project Structure

routes/
models/
services/
python/
data/
middleware/

Installation

Install Node.js Dependencies

npm install

Install Python Dependencies

pip install -r requirements.txt

Configure Environment Variables

Create a .env file:

MONGO_URI=your_mongodb_connection_string
PORT=3001

Run Application

node index.js

Workflow

1. User uploads a prescription image.
2. EasyOCR extracts text from the image.
3. Medicines are matched against the dataset.
4. Dose schedules are generated.
5. Data is stored in MongoDB.
6. User can track doses and receive reminders.

Limitations

* OCR accuracy depends on image quality.
* Dose schedules use predefined rules.
* Authentication is not implemented.

Future Work

* User authentication
* Mobile push notifications
* AI-based dosage extraction
* Cloud deployment

Author

Eslam Mohamed
