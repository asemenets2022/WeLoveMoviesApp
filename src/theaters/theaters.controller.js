const theatersService = require("./theaters.service");

function list(req, res, next) {
    theatersService
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
}

function listMoviesByTheater(req, res, next) {
    theatersService
    .listMoviesByTheater()
    .then((data) => res.json({ data }))
    .catch(next);
}

module.exports = {
    list: [listMoviesByTheater, list],
}