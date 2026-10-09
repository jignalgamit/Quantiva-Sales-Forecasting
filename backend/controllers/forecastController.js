const Forecast = require('../models/Forecast');
const axios = require('axios');
const FormData = require('form-data');

// @desc    Run ML forecast on uploaded CSV
// @route   POST /api/forecasts/predict
// @access  Private
const predictFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    // Forward the CSV to the Python ML server
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname || 'data.csv',
      contentType: 'text/csv',
    });

    let mlData;
    try {
      const mlResponse = await axios.post('http://localhost:5001/predict', formData, {
        headers: formData.getHeaders(),
        timeout: 120000,  // 2 min timeout
      });
      mlData = mlResponse.data;
    } catch (mlErr) {
      if (mlErr.code === 'ECONNREFUSED') {
        return res.status(503).json({
          message:
            'ML server is not running. Please start it:\n  cd backend/ml\n  pip install -r requirements.txt\n  python ml_model.py',
        });
      }
      const errMsg = mlErr.response?.data?.error || mlErr.message;
      return res.status(422).json({ message: `ML error: ${errMsg}` });
    }

    const { reportData } = mlData;

    // Save forecast to MongoDB (Only if connected)
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const forecast = new Forecast({
        userId: req.user._id,
        name: req.file.originalname.replace(/\.csv$/i, '') || `Forecast ${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        records: reportData.records || 0,
        reportData,
      });
      await forecast.save();
      return res.json({ success: true, reportData, forecastId: forecast._id });
    }

    // Database-Optional fallback
    console.log('Skipping database save: Running in Mock Mode');
    res.json({ 
      success: true, 
      reportData, 
      message: 'Forecast generated but not saved (Database offline)' 
    });
  } catch (error) {
    console.error('Forecast controller error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new forecast (save existing report data)
// @route   POST /api/forecasts
// @access  Private
const createForecast = async (req, res) => {
  const { name, records, reportData } = req.body;

  try {
    const forecast = new Forecast({
      userId: req.user._id,
      name,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      records,
      reportData,
    });

    const createdForecast = await forecast.save();
    res.status(201).json(createdForecast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user forecasts
// @route   GET /api/forecasts
// @access  Private
const getForecasts = async (req, res) => {
  try {
    const forecasts = await Forecast.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(forecasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete forecast
// @route   DELETE /api/forecasts/:id
// @access  Private
const deleteForecast = async (req, res) => {
  try {
    const forecast = await Forecast.findById(req.params.id);

    if (forecast) {
      if (forecast.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }
      await Forecast.deleteOne({ _id: req.params.id });
      res.json({ message: 'Forecast removed' });
    } else {
      res.status(404).json({ message: 'Forecast not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  predictFromCSV,
  createForecast,
  getForecasts,
  deleteForecast,
};
