import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

const createLikeForSong = asyncHandler(async(req, res) => {
    let { user_id, song_id } = req.body;

    if (
        [user_id, song_id].some((field) => !field)
    ) {
        throw new ApiError(400, "All fields are necessary");
    }

    // Prevent the same user from liking the same song twice.
    const existing = await prisma.like.findFirst({
        where: { user_id, song_id }
    });

    if (existing) {
        return res
        .status(200)
        .json(
            new ApiResponse(200, { like: existing }, "Already liked")
        );
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

// Unlike a song — removes the like row for this user + song, if it exists.
const deleteLikeForSong = asyncHandler(async(req, res) => {
    let { user_id, song_id } = req.body;

    if (
        [user_id, song_id].some((field) => !field)
    ) {
        throw new ApiError(400, "All fields are necessary");
    }

    const existing = await prisma.like.findFirst({
        where: { user_id, song_id }
    });

    if (!existing) {
        return res
        .status(200)
        .json(
            new ApiResponse(200, { deleted: false }, "Like did not exist")
        );
    }

    await prisma.like.delete({
        where: { id: existing.id }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, { deleted: true }, "Successfully removed like")
    );
});

// Returns every like for a song, with the liking user's display name,
// so the frontend can show a count + a dropdown of who liked it.
const findLikesBySongId = asyncHandler(async(req, res) => {
    let { song_id } = req.query;

    if (!song_id) {
        throw new ApiError(400, "Song Id undefined");
    }

    const likes = await prisma.like.findMany({
        where: {
            song_id: parseInt(song_id, 10)
        },
        include: {
            user: {
                select: { id: true, display_name: true }
            }
        },
        orderBy: {
            id: "desc"
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            { likes: likes },
            "Successfully found likes"
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
    deleteLikeForSong,
    findLikesBySongId,
    createLikeForComment
}