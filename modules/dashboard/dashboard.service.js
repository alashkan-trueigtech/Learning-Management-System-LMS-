
const {
    User,
    Course,
    CourseInstructor,
    Enrollment,
    Review,
    Lesson,
    LessonProgress,
} = require("../../models");

const { Op } = require("sequelize");

// ADMIN DASHBOARD
const getAdminDashboard = async () => {
    const [
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        draftCourses,
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalReviews,
    ] = await Promise.all([
        User.count(),
        User.count({ where: { role: "student" } }),
        User.count({ where: { role: "instructor" } }),
        Course.count(),
        Course.count({ where: { status: "published" } }),
        Course.count({ where: { status: "draft" } }),
        Enrollment.count(),
        Enrollment.count({ where: { status: "active" } }),
        Enrollment.count({ where: { status: "completed" } }),
        Review.count(),
    ]);

    return {
        users: {
            total: totalUsers,
            students: totalStudents,
            instructors: totalInstructors,
        },
        courses: {
            total: totalCourses,
            published: publishedCourses,
            draft: draftCourses,
        },
        enrollments: {
            total: totalEnrollments,
            active: activeEnrollments,
            completed: completedEnrollments,
        },
        totalReviews,
    };
};

// INSTRUCTOR DASHBOARD
const getInstructorDashboard = async (instructorId) => {
    const assignments = await CourseInstructor.findAll({
        where: { instructorId },
        include: [
            {
                model: Course,
                as: "course",
                attributes: ["id", "title", "status", "level"],
            },
        ],
    });

    const courseIds = assignments.map((item) => item.courseId);

    if (courseIds.length === 0) {
        return {
            totalCourses: 0,
            totalStudents: 0,
            totalEnrollments: 0,
            courses: [],
        };
    }

    const [totalEnrollments, totalStudents] = await Promise.all([
        Enrollment.count({
            where: {
                courseId: { [Op.in]: courseIds },
                status: { [Op.in]: ["active", "completed"] },
            },
        }),

        Enrollment.count({
            where: {
                courseId: { [Op.in]: courseIds },
                status: { [Op.in]: ["active", "completed"] },
            },
            distinct: true,
            col: "user_id",
        }),
    ]);

    return {
        totalCourses: assignments.length,
        totalStudents,
        totalEnrollments,
        courses: assignments.map((item) => item.course),
    };
};

// STUDENT DASHBOARD
const getStudentDashboard = async (studentId) => {
    const enrollments = await Enrollment.findAll({
        where: {
            userId: studentId,
            status: { [Op.in]: ["active", "completed"] },
        },
        include: [
            {
                model: Course,
                as: "course",
                attributes: ["id", "title", "thumbnail", "level", "status"],
            },
        ],
    });

    let totalLessons = 0;
    let completedLessons = 0;

    const courses = await Promise.all(
        enrollments.map(async (enrollment) => {
            const course = enrollment.course;

            const lessons = await Lesson.findAll({
                where: {
                    courseId: course.id,
                    isPublished: true,
                },
                attributes: ["id"],
            });

            const lessonIds = lessons.map((lesson) => lesson.id);

            const completed = lessonIds.length
                ? await LessonProgress.count({
                    where: {
                        userId: studentId,
                        lessonId: { [Op.in]: lessonIds },
                        isCompleted: true,
                    },
                })
                : 0;

            totalLessons += lessonIds.length;
            completedLessons += completed;

            return {
                enrollmentId: enrollment.id,
                course,
                enrollmentStatus: enrollment.status,
                totalLessons: lessonIds.length,
                completedLessons: completed,
                completionPercentage: lessonIds.length
                    ? Math.round((completed / lessonIds.length) * 100)
                    : 0,
            };
        })
    );

    return {
        totalCourses: courses.length,
        completedCourses: courses.filter(
            (item) => item.enrollmentStatus === "completed"
        ).length,
        totalLessons,
        completedLessons,
        overallCompletionPercentage: totalLessons
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0,
        courses,
    };
};

module.exports = {
    getAdminDashboard,
    getInstructorDashboard,
    getStudentDashboard,
};

