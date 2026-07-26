import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

const createStructuredReview = asyncHandler(async(req, res) => {
    let { songId, userId, melody, rhythm, pitch, voice } = req.body;

    // FIX: `!field` treats 0 as missing, which breaks the lowest
    // possible score on a 0-100 scale. Check for undefined/null instead.
    if (
        [songId, userId, melody, rhythm, pitch, voice].some(
            (field) => field === undefined || field === null
        )
    ) {
        throw new ApiError(400, "All fields are necessary");
    }

    const existingSR = await prisma.structured_review.findUnique({
        where: {
            songId_userId: {
                songId,
                userId
            }
        }
    });

    if (existingSR) {
        throw new ApiError(409, "Structured Review by this user on this song already exists");
    }

    const structuredReview = await prisma.structured_review.create({
        data: {
            melody,
            rhythm,
            pitch,
            voice,
            song: {
                connect: {
                    id: songId
                }
            },
            user: {
                connect: {
                    id: userId
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
                structuredReview: structuredReview
            },
            "Successfully created structured review"
        )
    )
});

const findStructuredReviewsBySongId = asyncHandler(async(req, res) => {
    let { songId } = req.query;

    if (!songId) {
        throw new ApiError(400, "Song Id undefined");
    }

    // FIX: req.query values are always strings; songId is an Int column.
    const structuredReviews = await prisma.structured_review.findMany({
        where: {
            songId: parseInt(songId, 10)
        }
    });

    if (!structuredReviews) {
        throw new ApiError(500, "Error finding structured reviews");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                structuredReviews: structuredReviews
            },
            "Successfully found structured reviews"
        )
    );
});

export {
    createStructuredReview,
    findStructuredReviewsBySongId
}