const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Account = require('../models/accountDetails');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = await Admin.create({
      name, email, mobile, password
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      // token: generateToken(admin._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    // if (user.isLocked) return res.status(403).json({ message: 'Account is locked' });

    const isMatch = await bcrypt.compare(password, admin.password);
    // if (!isMatch) {
    //   admin.loginAttempts++;
    //   if (admin.loginAttempts >= 3) {
    //     admin.isLocked = true;
    //   }
    //   await admin.save();
    //   return res.status(400).json({ message: 'Invalid credentials' });
    // }

    // admin.loginAttempts = 0;
    await admin.save();

    res.json({ token: generateToken(admin._id), name: admin.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingAccounts = async (req, res) => {
  try {
    const pending = await Account.find({ status: 'PENDING' });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending accounts' });
  }
};

exports.getAccountsById = async (req, res) => {
  try {
    const pending = await Account.findById(req.params.id);
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: 'No matching user with this id found' });
  }
};

exports.approveAccount = async (req, res) => {
  try {
    await Account.findByIdAndUpdate(req.params.id, { status: 'ACTIVE' });
    res.json({ message: 'Account approved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving account' });
  }
};

exports.rejectAccount = async (req, res) => {
  const { id } = req.params;

  const request = await Account.findById(id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  request.status = 'REJECTED';
  await request.save();

  res.json({ message: 'Account request rejected' });
};
