const mongoose = require('mongoose');

const accountRequestSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  email: String,
  phone: String,
  address: String,
  dob: Date,
  accountNumber: {type: String, unique: true},
  amount: {type: Number, default: 500},
  aadhar: {type: String, unique: true},
  occupation: String,
  debitCard: {
    type: String,
    enum: ['YES', 'NO'],
    default: 'NO'
  },
  accountType: { type: String, enum: ['SAVINGS', 'CURRENT']},
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'],
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Account = mongoose.model('AccountRequest', accountRequestSchema);
module.exports = Account;
