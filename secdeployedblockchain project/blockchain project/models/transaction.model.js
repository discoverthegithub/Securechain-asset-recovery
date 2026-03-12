const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  assetTitle: { type: String, required: true },
  beneficiary: { type: String, required: true },
  transferTime: { type: Date, default: Date.now },
  status: { type: String, enum: ['done'], default: 'done' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema); 