const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function list(req, res, next) {
  const is_showing = req.query.is_showing;
  if(is_showing) {
    moviesService
    .listByShowingStatus() 
    .then((data) => 
    res.json({ data }))
    .catch(next);
  } else {
    moviesService
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
  }
}

function movieExists(req, res, next) {
    moviesService
    .read(req.params.movieId)
    .then((movie) => {
        if(movie) {
            res.locals.movie = movie;
            return next();
        }
        next({ status: 404, message: 'Movie cannot be found' });
    })
    .catch(next);
}

function read(req, res) {
    const { movie: data } = res.locals;
    res.json({ data });
}

async function listTheatersByMovieId(req, res, next) {
    res.json({ data: await moviesService.listTheatersByMovieId(req.params.movieId) })
}

async function listReviewsAndCriticsByMovieId(req, res, next) {
    res.json({ data: await moviesService.listReviewsAndCriticsByMovieId(req.params.movieId) })
}

module.exports = {
  list,
  read: [movieExists, read],
  listTheatersByMovieId: asyncErrorBoundary(listTheatersByMovieId),
  listReviewsAndCriticsByMovieId: asyncErrorBoundary(listReviewsAndCriticsByMovieId),
};