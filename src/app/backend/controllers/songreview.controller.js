import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { IoPrismSharp } from "react-icons/io5";

const prisma = new PrismaClient();

const createSongReview = asyncHandler(async(req, res) => {
    let { user_id, song_id, review_text, rating } = req.body;

    if (
        [user_id, song_id, review_text, rating].some((field) => !field)
        ||
        (review_text?.trim() === "")
    ) {
        throw new ApiError(401, "All fields are necessary");
    }

    const songReview = await prisma.song_review.create({
        data: {
            user_id,
            song_id,
            review_text,
            rating
        }
    });

    if (!songReview) {
        throw new ApiError(500, "Error creating song review");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                songReview: songReview
            },
            "Successfully created song review"
        )
    );
});

const findSongReviewsBySongId = asyncHandler(async(req, res) => {
    let { song_id } = req.query;

    if (!song_id) {
        throw new ApiError(401, "Song Id undefined");
    }

    const songReviews = await prisma.song_review.findMany({
        where: {
            song_id: song_id
        }
    });

    if (!songReviews) {
        throw new ApiError(500, "Error finding song reviews");
    }

    return res
    .status(200)
    .json(
        new ApiError(
            200,
            {
                songReviews: songReviews
            },
            "Successfully found song reviews"
        )
    )
});

export {
    createSongReview,
    findSongReviewsBySongId
}