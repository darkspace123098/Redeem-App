const mongoose = require('mongoose');
const RedemptionSchema = new mongoose.Schema({
  name: String,
  phone: String,
  code: String,
  reward: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Redemption', RedemptionSchema);
