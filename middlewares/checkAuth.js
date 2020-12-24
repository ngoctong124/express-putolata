const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

module.exports = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    let token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Auth failed.',
        });
      }

      if (decoded) {
        User.findById(decoded.userId).then((currentUser) => {
          if (!currentUser) {
            return res.status(401).json({
              message: 'Auth failed.',
            });
          }

          req.user = currentUser;
          next();
        });
      }
    });
  } else {
    return res.status(401).json({
      message: 'Auth failed.',
    });
  }
};
