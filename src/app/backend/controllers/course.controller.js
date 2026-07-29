import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { IoPrismSharp } from "react-icons/io5";

const prisma = new PrismaClient();

const createCourse = asyncHandler(async(req, res) => {
    let { title, description, category, language_id, price, QR_file_path } = req.body;

    const trainer_id = req.trainer.id;

    if (!trainer_id) {
        throw new ApiError(401, "Unauthorized Request");
    }

    if (
        [title, description, category, QR_file_path].some(
            (field) => !field || field?.trim() === ""
        ) || (
            [price, language_id].some((field) => !field)
        )
    ) {
        throw new ApiError(401, "All fields are necessary");
    }

    const course = await prisma.course.create({
        data: {
            title,
            description,
            category,
            language_id,
            trainer_id,
            price,
            QR_file_path
        }
    });

    if (!course) {
        throw new ApiError(500, "Error creating course");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                createdCourse: course
            },
            "Successfully created course"
        )
    )
});

const findCourses = asyncHandler(async(req, res) => {
    const courses = await prisma.course.findMany({
        where: {
            is_published: true,
        },
        include: {
            language: true,
            trainer: true,
        },
    });

    if (!courses) {
        throw new ApiError(500, "Error finding courses");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                courses: courses
            },
            "Successfully found courses"
        )
    );
});

const findCoursesByTitle = asyncHandler(async(req, res) => {
    let { title } = req.query;

    if (!title || title?.trim() === "") {
        throw new ApiError(401, "Title empty or undefined");
    }

    const courses = await prisma.course.findMany({
        where: {
            title: title
        },
        include: {
            trainer: true,
            language: true
        }
    });

    if (!courses) {
        throw new ApiError(500, "Error finding courses");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                courses: courses
            },
            "Successfully found courses"
        )
    )
});

const findCoursesByCategory = asyncHandler(async(req, res) => {
    let { category } = req.query;

    if (!category || category?.trim() === "") {
        throw new ApiError(401, "Category empty or undefined");
    }

    const courses = await prisma.course.findMany({
        where: {
            category: category
        },
        include: {
            trainer: true,
            language: true
        }
    });

    if (!courses) {
        throw new ApiError(500, "Error finding courses");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                courses: courses
            },
            "Successfully found courses"
        )
    );
});

const findCoursesByLanguage = asyncHandler(async(req, res) => {
    let { language_id } = req.query;

    if (!language_id) {
        throw new ApiError(401, "Language field undefined");
    }

    const course = await prisma.course.findMany({
        where: {
            language_id: language_id
        },
        include: {
            trainer: true,
            language: true
        }
    });

    if (!course) {
        throw new ApiError(500, "Error finding courses");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                courses: courses
            },
            "Successfully found courses"
        )
    )
});

const findCoursesByTrainerId = asyncHandler(async(req, res) => {
    const trainer_id = req.trainer.id;

    if (!trainer_id) {
        throw new ApiError(401, "Unauthorized Request");
    }

    const courses = await prisma.course.findMany({
        where: {
            trainer_id: trainer_id,
            is_published: true,
        },
        include: {
            language: true
        }
    });

    if (!courses) {
        throw new ApiError(500, "Error finding courses");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                courses: courses
            },
            "Successfully found courses"
        )
    );
});

const deleteCourse = asyncHandler(async(req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        throw new ApiError(400, "Course Id Undefined");
    }

    const trainerId = req.trainer.id;

    if (!trainerId) {
        throw new ApiError(401, "Unauthorized Request");
    }

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    });

    if (!course) {
        throw new ApiError(404, "Course Not Found");
    }

    await prisma.course.delete({
        where: {
            id: courseId
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Successfully Deleted Course"
        )
    );
});

const publishCourse = asyncHandler(async(req, res) => {
    const { course_id } = req.body;

    if (!course_id) {
        throw new ApiError(400, "Course Id Undefined");
    }

    const course = await prisma.course.findUnique({
        where: {
            id: course_id
        }
    });

    if (!course) {
        throw new ApiError(404, "Course Not Found");
    }

    const updatedCourse = await prisma.course.update({
        where: {
            id: course_id
        },
        data: {
            is_published: true
        }
    });

    if (!updatedCourse) {
        throw new ApiError(500, "Error Publishing Course");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                updatedCourse: updatedCourse
            },
            "Successfully Published Course"
        )
    );
});

const findCourseById = asyncHandler(async(req, res) => {
    const { course_id } = req.query;

    if (!course_id) {
        throw new ApiError(400, "Course Id Undefined");
    }

    const course = await prisma.course.findUnique({
        where: {
            id: parseInt(course_id, 10)
        },
        include: {
            trainer: true,
            language: true
        }
    });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                course: course
            },
            "Successfully Found Course"
        )
    );
});

export {
    createCourse,
    findCourses,
    findCoursesByTitle,
    findCoursesByCategory,
    findCoursesByLanguage,
    findCoursesByTrainerId,
    deleteCourse,
    publishCourse,
    findCourseById
}