const Category = require('../models/categoryModel');

module.exports.getCategories = (req, res) => {
  Category.find()
    .then((categories) => {
      return res.status(200).json({
        message: 'Success.',
        data: categories,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
};
