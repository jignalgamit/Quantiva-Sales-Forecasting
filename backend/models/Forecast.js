const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  records: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Completed',
  },
  reportData: {
    type: Object,
    required: true,
  }
}, {
  timestamps: true,
});

const Forecast = mongoose.model('Forecast', forecastSchema);

module.exports = Forecast;
