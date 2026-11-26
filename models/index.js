const User = require("./user.model");
const Category = require("./category.model");
const Course = require("./course.model");
const CourseInstructor = require("./courseInstructor.model");
const Lesson = require("./lesson.model");
const Enrollment = require("./enrollment.model");
const LessonProgress = require("./lessonProgress.model");
const Review = require("./review.model");
const RefreshToken = require("./refreshToken.model");

// ==================================
// CATEGORY AND COURSE ASSOCIATION
// ==================================

Category.hasMany(Course, {
    foreignKey: "categoryId",
    as: "courses",
});

Course.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
});

// ==================================
// COURSE AND LESSON ASSOCIATION
// ==================================

Course.hasMany(Lesson, {
    foreignKey: "courseId",
    as: "lessons",
});

Lesson.belongsTo(Course, {
    foreignKey: "courseId",
    as: "course",
});

// ==================================
// USER AND COURSE INSTRUCTOR ASSOCIATION
// ==================================

User.hasMany(CourseInstructor, {
    foreignKey: "instructorId",
    as: "instructorAssignments",
});

CourseInstructor.belongsTo(User, {
    foreignKey: "instructorId",
    as: "instructor",
});

Course.hasMany(CourseInstructor, {
    foreignKey: "courseId",
    as: "instructorAssignments",
});

CourseInstructor.belongsTo(Course, {
    foreignKey: "courseId",
    as: "course",
});

// Many-to-Many relationship

Course.belongsToMany(User, {
    through: CourseInstructor,
    foreignKey: "courseId",
    otherKey: "instructorId",
    as: "instructors",
});

User.belongsToMany(Course, {
    through: CourseInstructor,
    foreignKey: "instructorId",
    otherKey: "courseId",
    as: "instructedCourses",
});

// ==================================
// USER AND ENROLLMENT ASSOCIATION
// ==================================

User.hasMany(Enrollment, {
    foreignKey: "userId",
    as: "enrollments",
});

Enrollment.belongsTo(User, {
    foreignKey: "userId",
    as: "student",
});

Course.hasMany(Enrollment, {
    foreignKey: "courseId",
    as: "enrollments",
});

Enrollment.belongsTo(Course, {
    foreignKey: "courseId",
    as: "course",
});

// ==================================
// USER AND LESSON PROGRESS ASSOCIATION
// ==================================

User.hasMany(LessonProgress, {
    foreignKey: "userId",
    as: "lessonProgress",
});

LessonProgress.belongsTo(User, {
    foreignKey: "userId",
    as: "student",
});

Lesson.hasMany(LessonProgress, {
    foreignKey: "lessonId",
    as: "progress",
});

LessonProgress.belongsTo(Lesson, {
    foreignKey: "lessonId",
    as: "lesson",
});

// ==================================
// USER AND REVIEW ASSOCIATION
// ==================================

User.hasMany(Review, {
    foreignKey: "userId",
    as: "reviews",
});

Review.belongsTo(User, {
    foreignKey: "userId",
    as: "student",
});

Course.hasMany(Review, {
    foreignKey: "courseId",
    as: "reviews",
});

Review.belongsTo(Course, {
    foreignKey: "courseId",
    as: "course",
});

// ==================================
// USER AND REFRESH TOKEN ASSOCIATION
// ==================================

User.hasMany(RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
});

RefreshToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// ==================================
// EXPORT ALL MODELS
// ==================================

module.exports = {
    User,
    Category,
    Course,
    CourseInstructor,
    Lesson,
    Enrollment,
    LessonProgress,
    Review,
    RefreshToken,
};