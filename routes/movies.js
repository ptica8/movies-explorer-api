const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkPattern } = require('../utils/constants');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

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
}), createMovie);

router.delete('/:Id', celebrate({
  params: Joi.object().keys({
    Id: Joi.string().length(24).hex().required(),
  })
}), deleteMovie);

module.exports = router;
