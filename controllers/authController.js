const User = require('../models/User');
const Account = require('../models/accountDetails');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendOTPEmail = require('../utils/otpService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  const { name, email, password, transactionPassword, mobile, accountNumber } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name, email, password, transactionPassword, mobile, accountNumber
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.isLocked) return res.status(403).json({ message: 'Account is locked' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts++;
      if (user.loginAttempts >= 3) {
        user.isLocked = true;
      }
      await user.save();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user.loginAttempts = 0;
    await user.save();

    res.json({ token: generateToken(user._id), name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addAccount = async (req, res) => {
  const { name, fatherName, email, phone, address, dob, amount, aadhar, occupation, debitCard, accountType } = req.body;

  try {
    const userExists = await Account.findOne({ aadhar });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

      // Generate dummy account number
    const accountNumber = Math.floor(1000000000 + Math.random() * 900000000000).toString();

    const user = await Account.create({
      name, fatherName, email, phone, address, dob, amount, accountNumber, aadhar, occupation, debitCard, accountType
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000; // 10 minutes
  await user.save();

  await sendOTPEmail(email, otp);
  res.json({ message: 'OTP sent to registered email.' });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || Date.now() > user.otpExpires)
    return res.status(400).json({ message: 'Invalid or expired OTP' });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.otp = null;
  user.otpExpires = null;
  user.loginAttempts = 0;
  user.isLocked = false;
  await user.save();

  res.json({ message: 'Password reset successful' });
};

