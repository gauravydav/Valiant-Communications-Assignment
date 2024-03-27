
const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/upload-history', authMiddleware.authenticateUser, authMiddleware.checkRole('staff'), historyController.getUploadHistory);

module.exports = router;
