const express = require('express');
const router = express.Router();
const {
  addPayee, getPayees, transferFunds
} = require('../controllers/fundTransferController');
const protect = require('../middlewares/authMiddleware');

router.use(protect);
router.post('/payee', addPayee);
router.get('/payees', getPayees);
router.post('/transfer', transferFunds); // mode in body (NEFT, RTGS, IMPS)

module.exports = router;
