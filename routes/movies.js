const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkPattern } = require('../utils/constants');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkPattern),
    trailerLink: Joi.string().required().pattern(linkPattern),
    thumbnail: Joi.string().required().pattern(linkPattern),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  })
}), createFilm);

router.delete('/:Id', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  })
}), deleteFilm);

module.exports = router;
