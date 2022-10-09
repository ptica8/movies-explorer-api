const limiter = require('express-rate-limit');

module.exports.rateLimiter = limiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: 'Превышено количество запросов за 24 часа с одного IP',
  standardHeaders: true,
  legacyHeaders: false,
});