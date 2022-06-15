const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCategory = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function read(reviewId) {
    return knex("reviews").select("*").where({ review_id: reviewId }).first();
  }

function destroy(reviewId) {
    return knex("reviews").where({ review_id: reviewId }).del();
}

function update(updatedReview) {
    return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("r.*", "c.*")
    .where({ "r.review_id": updatedReview.review_id})
    .update(updatedReview)
    .then(() => {
      return knex("reviews as r")
      .join("critics as c", "c.critic_id", "r.critic_id")
      .select(
        "r.content",
        "r.created_at",
        "r.updated_at",
        "r.critic_id",
        "r.movie_id",
        "r.review_id",
        "r.score",
        "c.*")
      .where({ "r.review_id": updatedReview.review_id})
    })
    .then((updatedRecords) => updatedRecords[0])
    .then(addCategory);
}

module.exports = {
    read,
    delete: destroy,
    update,
}