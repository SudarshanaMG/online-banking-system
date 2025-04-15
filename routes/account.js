const express = require('express');
const router = express.Router();
const { getSummary, getStatement } = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get('/summary', authMiddleware, getSummary);
router.get('/statement', authMiddleware, getStatement);

module.exports = router;
