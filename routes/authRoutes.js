const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, addAccount  } = require('../controllers/authController');


router.post('/register', register);
router.post('/login', login);
router.post('/add-account', addAccount);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;
