const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
  User.findOne({ email: req.body.email, role: 'admin' })
    .then((user) => {
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
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
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
  User.findOne({ email: req.body.email, role: 'user' })
    .then((user) => {
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
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

module.exports.forgotPassword = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'No users found.',
        });
      }

      crypto.randomBytes(3, (err, buf) => {
        if (err) {
          return res.status(500).json({
            message: err,
          });
        }

        let token = buf.toString('hex');

        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        user.save().catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        let mailOptions = {
          from: `PuToLaTa <${process.env.EMAIL_USERNAME}>`,
          to: user.email,
          subject: 'Reset your password',
          text: `Your password reset token (valid for only 10 minutes) ${token}`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res.status(500).json({
              message: err,
            });
          }

          return res.status(201).json({
            message: 'Token sent to your email.',
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

module.exports.resetPassword = (req, res) => {
  User.findOne({
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message: 'Token is invalid or has expired.',
        });
      }

      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }

        user.password = hash;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        user
          .save()
          .then((result) => {
            let token = jwt.sign(
              { userId: user._id, role: user.role },
              process.env.JWT_KEY,
              {
                expiresIn: process.env.JWT_EXPIRES_IN,
              }
            );

            return res.status(201).json({
              message: 'Password reset successful.',
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
