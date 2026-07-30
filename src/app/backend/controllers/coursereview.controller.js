import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

const createCourseReview = asyncHandler(async(req, res) => {
    let { course_id, review_text, rating } = req.body;
    
    const user_id = req.user.id;

    if (!user_id) {
        throw new ApiError(401, "Unauthorized Request");
    }

    if (
        [course_id, review_text, rating].some((field) => !field)
        ||
        (review_text?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are necessary");
    }

    const courseReview = await prisma.course_review.create({
        data: {
            user_id,
            course_id,
            review_text,
            rating
        }
    });

    if (!courseReview) {
        throw new ApiError(500, "Error creating course review");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                courseReview: courseReview
            },
            "Succesfully created course review"
        )
    )
});

const findCourseReviewsByCourseId = asyncHandler(async(req, res) => {
    let { courseId } = req.query;

    if (!courseId) {
        throw new ApiError(400, "Course Id Undefined");
    }

    const courseReviews = await prisma.course_review.findMany({
        where: {
            course_id: parseInt(courseId, 10)
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                courseReviews: courseReviews
            },
            "Successfully found course reviews"
        )
    );
});

export {
    createCourseReview,
    findCourseReviewsByCourseId
}