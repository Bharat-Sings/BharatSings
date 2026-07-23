import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createSong = asyncHandler(async (req, res) => {
    let { title, description, genre } = req.body;

    if (
        [title, description, genre].some((field) => !field || field?.trim() === "")
    ) {
        throw new ApiError(401, "All fields are required");
    }

    let song = await prisma.song.create({
        data: {
            title,
            description,
            genre
        }
    });

    if (!song) {
        throw new ApiError(500, "Error creating the song");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                createdSong: song
            },
            "Song created successfully"
        )
    );
});

const findSongs = asyncHandler(async (req, res) => {
    const songs = await prisma.song.findMany();

    if (!songs) {
        throw new ApiError(500, "Error finding songs");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                songs: songs
            }, 
            "Successfully found the songs"
        )
    );
});

const findSongsByGenre = asyncHandler(async (req, res) => {
    let { genre } = req.query;

    if (!genre || genre?.trim() === "") {
        throw new ApiError(401, "Genre empty or undefined");
    }

    const songs = await prisma.song.findMany({
        where: {
            genre: genre
        }
    });

    if (!songs) {
        throw new ApiError(500, "Error finding songs");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                songs: songs
            },
            "Successfully found songs"
        )
    );
});

const findSongsByTitle = asyncHandler(async (req, res) => {
    let { title } = req.query;

    if (!title || title?.trim() === "") {
        throw new ApiError(401, "Title empty or undefined");
    }

    const songs = await prisma.song.findMany({
        where: {
            title: title
        }
    });

    if (!songs) {
        throw new ApiError(500, "Error finding songs");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                songs: songs
            },
            "Successfully found songs"
        )
    )
});

export {
    createSong,
    findSongs,
    findSongsByGenre,
    findSongsByTitle
}