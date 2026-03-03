const mongoose = require('mongoose');
const User = require('./models/User');

const VariationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deviceId: { type: String },
  exercise: { type: String, required: true },
  variation: { type: String, required: true },
  rawValue: { type: Number, required: true },
  maxValue: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Variation = mongoose.models.Variation || mongoose.model('Variation', VariationSchema);

module.exports = { Variation, User };
