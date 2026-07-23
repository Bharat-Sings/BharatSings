import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

const createCourse = asyncHandler(async(req, res) => {
    let { title, description, category, language, trainer_id, price } = req.body;

    if (
        [title, description, category, language, trainer_id, price].some(
            (field) => !field || field?.trim() === ""
        )
    ) {
        throw new ApiError(401, "All fields are necessary");
    }

    const course = await prisma.course.create({
        data: {
            title,
            description,
            category,
            language,
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

export {
    createCourse
}