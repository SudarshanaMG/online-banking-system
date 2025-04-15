const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.getSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // console.log(user);
    if(user.status !== 'ACTIVE'){
      res.status(403).json({ message: 'Account is not active' });
    }
    const recentTransactions = await Transaction.find({ senderId: req.user.id }).sort({ date: -1 }).limit(5);

    res.json({
      accountNumber: user.accountNumber,
      balance: user.balance,
      recentTransactions
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStatement = async (req, res) => {
  const { from, to } = req.body;
  const user = await User.findById(req.user.id);
  // console.log(user);
  if(user.status !== 'ACTIVE'){
    res.status(403).json({ message: 'Account is not active' });
  }
  try {
    const statement = await Transaction.find({
      senderId: req.user.id,
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to)
      }
    }).sort({ date: -1 });

    res.json(statement);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching statement' });
  }
};
