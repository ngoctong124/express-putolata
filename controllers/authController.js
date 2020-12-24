const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

module.exports.adminSignup = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(409).json({
          message: 'User already registered.',
        });
      }

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }

        let user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: hash,
          role: 'admin',
        });

        let token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_KEY,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        user
          .save()
          .then((result) => {
            return res.status(201).json({
              message: 'User created.',
              token: token,
              user: result,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              error: err,
            });
          });
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

module.exports.adminSignin = (req, res) => {
  User.findOne({ email: req.body.email, role: 'admin' }).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed.',
      });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: 'Auth failed.',
        });
      }

      if (result) {
        let token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_KEY,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        return res.status(200).json({
          message: 'Auth successful.',
          token: token,
          user: user,
        });
      }

      return res.status(401).json({
        message: 'Auth failed.',
      });
    });
  });
};

module.exports.userSignup = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(409).json({
          message: 'User already registered.',
        });
      }

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }

        let user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: hash,
        });

        let token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_KEY,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        user
          .save()
          .then((result) => {
            return res.status(201).json({
              message: 'User created.',
              token: token,
              user: result,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              error: err,
            });
          });
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

module.exports.userSignin = (req, res) => {
  User.findOne({ email: req.body.email, role: 'user' }).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed.',
      });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: 'Auth failed.',
        });
      }

      if (result) {
        let token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_KEY,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        return res.status(200).json({
          message: 'Auth successful.',
          token: token,
          user: user,
        });
      }

      return res.status(401).json({
        message: 'Auth failed.',
      });
    });
  });
};
