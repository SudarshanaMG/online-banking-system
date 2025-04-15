const mongoose = require('mongoose');

const payeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  nickname: String,
  accountNumber: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payee', payeeSchema);
