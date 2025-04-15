const express = require('express');
const router = express.Router();
const { register, login, getPendingAccounts, approveAccount, rejectAccount, getAccountsById } = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/login', login);
router.post('/register', register);
router.use(adminMiddleware);
router.get('/pending-accounts', adminMiddleware, getPendingAccounts);
router.post('/approve/:id', adminMiddleware, approveAccount);
router.post('/reject/:id', adminMiddleware, rejectAccount);
router.get('/getAccount/:id', adminMiddleware, getAccountsById);

module.exports = router;
