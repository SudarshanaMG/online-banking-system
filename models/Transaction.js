const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientAccount: String,
  amount: Number,
  mode: { type: String, enum: ['NEFT', 'RTGS', 'IMPS'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
