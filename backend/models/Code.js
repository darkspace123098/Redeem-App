const mongoose = require('mongoose');
const CodeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  isUsed: { type: Boolean, default: false },
  reward: { type: String, default: '' },
  redeemedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Code', CodeSchema);
