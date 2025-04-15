const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
  transactionPassword: String,
  accountNumber: String,
  isLocked: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE'],
    default: 'PENDING'
  },
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
