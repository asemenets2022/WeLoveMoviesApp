const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  reviewsService
    .read(req.params.reviewId)
    .then((review) => {
      if (review) {
        res.locals.review = review;
        return next();
      }
      next({ status: 404, message: "Review cannot be found" });
    })
    .catch(next);
}

function read(req, res) {
  const { review: data } = res.locals;
  res.json({ data });
}

async function destroy(req, res) {
  const { review } = res.locals;
  await reviewsService.delete(review.review_id);
  res.sendStatus(204);
}

async function update(req, res) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await reviewsService.update(updatedReview);
  res.json({ data });
}

module.exports = {
  read: [reviewExists, read],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
