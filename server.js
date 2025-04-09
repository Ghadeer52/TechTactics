/*require('dotenv').config();
const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const path = require('path');

// Initialize Express app
const app = express();

// Set up AWS SDK
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create S3 instance
const s3 = new aws.S3();

// Set up multer storage using multer-s3
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET_NAME,
  acl: 'public-read', // Make files publicly readable
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, Date.now().toString() + path.extname(file.originalname)); // Generate unique file name
  },
});

const upload = multer({ storage });

// Endpoint to upload video to S3
app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video uploaded' });

  const videoUrl = req.file.location; // S3 URL of the uploaded video
  res.json({ message: 'Upload successful', video_url: videoUrl });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a simple Video model
const Video = mongoose.model('Video', new mongoose.Schema({
  filename: String,
  filepath: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
}));

// Set up multer for local file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Endpoint to upload video and save to MongoDB
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video uploaded' });

    // Save video metadata to MongoDB
    const video = new Video({
      filename: req.file.filename,
      filepath: req.file.path,
    });

    await video.save();

    res.json({
      message: 'Upload successful',
      video: {
        filename: video.filename,
        filepath: video.filepath,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
