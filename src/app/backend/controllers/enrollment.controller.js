import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { connect } from "mongoose";

const prisma = new PrismaClient();

const createEnrollment = asyncHandler(async(req, res) => {
    let { course_id, screenshot_id } = req.body;

    const user_id = req.user.id;

    if (!user_id) {
        throw new ApiError(401, "Unauthorized Request");
    }

    if (
        [course_id, screenshot_id].some((field) => !field)
    ) {
        throw new ApiError(401, "All fields are necessary");
    }

    const enrollment = await prisma.enrollment.create({
        data: {
            user: {
                connect: {
                    id: user_id
                }
            },
            course: {
                connect: {
                    id: parseInt(course_id, 10)
                }
            },
            screenshot: {
                connect: {
                    id: parseInt(screenshot_id, 10)
                }
            }
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                createdEnrollment: enrollment
            },
            "Successfully created enrollment"
        )
    );
});

const findEnrollmentsByCourseId = asyncHandler(async (req, res) => {
    let { course_id } = req.query;

    if (!course_id) {
        throw new ApiError(401, "Course Id Undefined");
    }

    const enrollments = await prisma.enrollment.findMany({
        where: {
            course_id: parseInt(course_id, 10)
        },
        include: {
            user: true,
            screenshot: true,
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                enrollments: enrollments
            },
            "Successfully found enrollments"
        )
    );
});

const findEnrollmentsByUserId = asyncHandler(async(req, res) => {
    const user_id = req.user.id;

    if (!user_id) {
        throw new ApiError(401, "Unauthorized Request");
    }

    const enrollments = await prisma.enrollment.findMany({
        where: {
            user_id: user_id
        },
        include: {
            course: {
                include: {
                    trainer: true,
                    language: true
                }
            }
        }
    });

    if (!enrollments) {
        throw new ApiError(500, "Error finding enrollments");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                enrollments: enrollments
            },
            "Successfully found enrollments"
        )
    );
});

export {
    createEnrollment,
    findEnrollmentsByCourseId,
    findEnrollmentsByUserId
}