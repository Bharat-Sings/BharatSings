import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { IoPrismSharp } from "react-icons/io5";

const prisma = new PrismaClient();

const createCourse = asyncHandler(async(req, res) => {
    let { title, description, category, language_id, trainer_id, price } = req.body;

    if (
        [title, description, category].some(
            (field) => !field || field?.trim() === ""
        ) || (
            [price, language_id, trainer_id].some((field) => !field)
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
            price
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
    const courses = await prisma.course.findMany();

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

export {
    createCourse,
    findCourses,
    findCoursesByTitle,
    findCoursesByCategory,
    findCoursesByLanguage
}