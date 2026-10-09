const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  predictFromCSV,
  createForecast,
  getForecasts,
  deleteForecast,
} = require('../controllers/forecastController');
const { protect } = require('../middleware/authMiddleware');

// Multer: store file in memory (no disk write)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// ML prediction from CSV file upload
router.post('/predict', protect, upload.single('file'), predictFromCSV);

// Standard CRUD
router.route('/').get(protect, getForecasts).post(protect, createForecast);
router.route('/:id').delete(protect, deleteForecast);

module.exports = router;
