import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

const createEnrollment = asyncHandler(async(req, res) => {
    let { user_id, course_id } = req.body;

    if (
        [user_id, course_id].some((field) => !field)
    ) {
        throw new ApiError(401, "All fields are necessary");
    }

    const enrollment = await prisma.enrollment.create({
        data: {
            user_id,
            course_id
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
            course_id: course_id
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

const findEnrollmentsByUserId = asyncHandler(async(req, res) => {
    let { user_id } = req.query;

    if (!user_id) {
        throw new ApiError(401, "User Id Undefined");
    }

    const enrollments = await prisma.enrollment.findMany({
        where: {
            user_id: user_id
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