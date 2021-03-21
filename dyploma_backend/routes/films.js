const express = require('express');
const router = express.Router();
const FilmsController = require('../controllers/FilmsController');

router.get('/search', FilmsController.getSearch);
router.get('/all', FilmsController.getAllFilms);
router.get('/:movieId', FilmsController.getMovieById);
router.post('/rate/:movieId', FilmsController.rateMovie);
router.get('/rated/:movieId', FilmsController.getUserRatedMovieById);
router.get('/recommendations/simmilarity', FilmsController.getUserRecommendationsBySimilarity);

module.exports = router;