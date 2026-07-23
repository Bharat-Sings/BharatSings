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

export {
    createEnrollment
}