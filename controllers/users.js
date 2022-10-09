const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((updateUser) => {
      if (!updateUser) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: updateUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!validator.isEmail(email)) {
    next(new BadRequestError('Введены некорректные данные'));
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email, password: hash, name,
      })

        .then((newUser) => {
          // eslint-disable-next-line no-shadow,no-underscore-dangle
          res.send({
            // eslint-disable-next-line max-len
            data: {
              // eslint-disable-next-line max-len
              email: newUser.email, name: newUser.name, _id: newUser._id,
            },
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Введены некорректные данные'));
          } else if (err.code === 11000) {
            next(new DuplicateError('Пользователь с таким Email уже зарегистрирован'));
          } else {
            next(err);
          }
        }));
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'my-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
