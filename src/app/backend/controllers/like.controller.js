import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { connect } from "mongoose";

const prisma = new PrismaClient();

const createLikeForSong = asyncHandler(async(req, res) => {
    let { user_id, song_id } = req.body;

    if (
        [user_id, song_id].some((field) => !field)
    ) {
        throw new ApiError(400, "All fields are necessary");
    }

    const like = await prisma.like.create({
        data: {
            user: {
                connect: {
                    id: user_id
                }
            },
            song: {
                connect: {
                    id: song_id
                }
            }
        }
    });

    if (!like) {
        throw new ApiError(500, "Error creating like");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                like: like
            },
            "Succesfully created like"
        )
    );
});

const createLikeForComment = asyncHandler(async(req, res) => {
    let { user_id, comment_id } = req.body;

    if (
        [user_id, comment_id].some((field) => !field)
    ) {
        throw new ApiError(400, "All fields are necessary");
    }

    const like = await prisma.like.create({
        data: {
            user: {
                connect: {
                    id: user_id
                }
            },
            comment: {
                connect: {
                    id: comment_id
                }
            }
        }
    });

    if (!like) {
        throw new ApiError(500, "Error creating like");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                like: like
            },
            "Succesfully created like"
        )
    );
});

export {
    createLikeForSong,
    createLikeForComment
}