const { Review, Course, Enrollment, User } = require("../../models");
const AppError = require("../../errors/AppError");

const checkCourseEligibility = async (courseId, userId) => {
    const course = await Course.findByPk(courseId);

    if (!course || course.status !== "published") {
        throw new AppError("Course not found", 404);
    }

    const enrollment = await Enrollment.findOne({
        where: {
            courseId,
            userId,
            status: ["active", "completed"]
        }
    });

    if (!enrollment) {
        throw new AppError("You must be enrolled in this course to review it", 403);
    }

    return course;
};

// CREATE REVIEW
const createReview = async (courseId, userId, reviewData) => {
    await checkCourseEligibility(courseId, userId);

    const existingReview = await Review.findOne({
        where: { courseId, userId }
    });

    if (existingReview) {
        throw new AppError("You have already reviewed this course", 409);
    }

    return await Review.create({
        courseId,
        userId,
        rating: reviewData.rating,
        comment: reviewData.comment
    });
};

// GET COURSE REVIEWS
const getCourseReviews = async (courseId) => {
    const course = await Course.findByPk(courseId);

    if (!course || course.status !== "published") {
        throw new AppError("Course not found", 404);
    }

    const reviews = await Review.findAll({
        where: { courseId },
        attributes: ["id", "rating", "comment", "createdAt"],
        include: [{
            model: User,
            as: "student",
            attributes: ["id", "firstName", "lastName"]
        }],
        order: [["createdAt", "DESC"]]
    });

    const totalReviews = reviews.length;

    const averageRating = totalReviews === 0
        ? 0
        : Number((
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
        ).toFixed(1));

    return {
        totalReviews,
        averageRating,
        reviews
    };
};

// UPDATE OWN REVIEW
const updateReview = async (reviewId, userId, reviewData) => {
    const review = await Review.findOne({
        where: { id: reviewId, userId }
    });

    if (!review) {
        throw new AppError("Review not found", 404);
    }

    await review.update(reviewData);
    return review;
};

// DELETE OWN REVIEW
const deleteReview = async (reviewId, userId) => {
    const review = await Review.findOne({
        where: { id: reviewId, userId }
    });

    if (!review) {
        throw new AppError("Review not found", 404);
    }

    await review.destroy();
    return { message: "Review deleted successfully" };
};

module.exports = {
    createReview,
    getCourseReviews,
    updateReview,
    deleteReview
};
