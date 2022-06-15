const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritics = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

function list() {
  return knex("movies").select("*");
}

function listByShowingStatus() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function listTheatersByMovieId(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.*")
    .where({ "mt.movie_id": movieId });
}

function listReviewsAndCriticsByMovieId(movieId) {
  return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then(reviews => reviews.map(review => addCritics(review)))
}

module.exports = {
  list,
  listByShowingStatus,
  read,
  listTheatersByMovieId,
  listReviewsAndCriticsByMovieId,
};
