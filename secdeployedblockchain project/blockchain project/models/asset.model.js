const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  beneficiary: { type: String, required: true }, // email
  recoveryTime: { type: Date, required: true },
  note: { type: String },
  credentials: { type: String },
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  deliveredAt: { type: Date },
  emailSent: { type: Boolean, default: false },
  processing: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema); 