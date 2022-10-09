const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validation: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Пароль должен быть длиннее 8 символов'],
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2, 'Имя должно быть длиннее 2-х символов'],
    maxlength: [30, 'Имя должно быть короче 30 символов'],
  },
}, {
  versionKey: false,
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Введены некорректные данные'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Введены некорректные данные'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
