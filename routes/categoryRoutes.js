const express = require('express');

const router = express.Router();

const checkAuth = require('../middlewares/checkAuth');
const restrictTo = require('../middlewares/restrictTo');

const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);

module.exports = router;
