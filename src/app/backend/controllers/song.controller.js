import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PrismaClient } from "@prisma/client";
import { connect } from "mongoose";

const prisma = new PrismaClient();

const createSong = asyncHandler(async (req, res) => {
    let { title, description, genreId, audioFileId } = req.body;

    if (
        [title, description].some((field) => !field || field?.trim() === "")
        ||
        [audioFileId, genreId].some((field) => !field)
    ) {
        throw new ApiError(401, "All fields are required");
    }

    let song = await prisma.song.create({
        data: {
            title,
            description,
            genre: {
                connect: {
                    id: parseInt(genreId, 10)
                }
            },
            audio_file: {
                connect: {
                    id: parseInt(audioFileId, 10)
                }
            }
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

const findSongsByGenreId = asyncHandler(async (req, res) => {
    let { genreId } = req.query;

    if (!genreId) {
        throw new ApiError(401, "Genre empty or undefined");
    }

    const songs = await prisma.song.findMany({
        where: {
            genre_id: parseInt(genreId)
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
    findSongsByGenreId,
    findSongsByTitle
}