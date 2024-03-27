const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/submitDetails', authMiddleware.authenticateUser, authMiddleware.checkRole('student'), uploadController.submitDetails);

module.exports = router;
