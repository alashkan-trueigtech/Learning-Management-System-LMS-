const reviewService = require("./review.service");

// CREATE REVIEW
const createReview = async (req, res, next) => {
    try {
        const review = await reviewService.createReview(
            req.params.courseId,
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// GET COURSE REVIEWS
const getCourseReviews = async (req, res, next) => {
    try {
        const result = await reviewService.getCourseReviews(
            req.params.courseId
        );

        res.status(200).json({
            success: true,
            message: "Course reviews fetched successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE REVIEW
const updateReview = async (req, res, next) => {
    try {
        const review = await reviewService.updateReview(
            req.params.reviewId,
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// DELETE REVIEW
const deleteReview = async (req, res, next) => {
    try {
        await reviewService.deleteReview(
            req.params.reviewId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getCourseReviews,
    updateReview,
    deleteReview
};
