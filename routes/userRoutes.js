const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

router.post('/signup', authController.userSignup);
router.post('/signin', authController.userSignin);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/resetpassword', authController.resetPassword);

module.exports = router;
