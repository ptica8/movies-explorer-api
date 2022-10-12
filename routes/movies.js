const router = require('express').Router();
const { celebrate } = require('celebrate');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieData, deleteMovieData } = require('../middlewares/validation');

router.get('/movies', getMovies);

router.post('/movies', celebrate(createMovieData), createMovie);

router.delete('/movies/:Id', celebrate(deleteMovieData), deleteMovie);

module.exports = router;
