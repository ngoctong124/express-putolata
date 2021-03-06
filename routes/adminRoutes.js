const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.post('/signup', authController.adminSignup);
router.post('/signin', authController.adminSignin);

module.exports = router;
