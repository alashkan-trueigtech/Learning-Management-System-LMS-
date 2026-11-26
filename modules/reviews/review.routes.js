const express = require("express");
const router = express.Router();

const reviewController = require("./review.controller");

const { authenticate } = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createReviewSchema,
    updateReviewSchema
} = require("./review.schema");

// CREATE REVIEW
router.post(
    "/courses/:courseId",
    authenticate,
    authorizeRoles("student"),
    validate(createReviewSchema),
    reviewController.createReview
);

// GET COURSE REVIEWS (PUBLIC)
router.get(
    "/courses/:courseId",
    reviewController.getCourseReviews
);

// UPDATE OWN REVIEW
router.patch(
    "/:reviewId",
    authenticate,
    authorizeRoles("student"),
    validate(updateReviewSchema),
    reviewController.updateReview
);

// DELETE OWN REVIEW
router.delete(
    "/:reviewId",
    authenticate,
    authorizeRoles("student"),
    reviewController.deleteReview
);

module.exports = router;
