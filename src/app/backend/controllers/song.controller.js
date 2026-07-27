import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createSong = asyncHandler(async (req, res) => {
    let { title, description, genreId, audioFileId, forSale, price } = req.body;
    const userId = req.user.id;

    if (
        [title, description].some((field) => !field || field?.trim() === "")
        ||
        [audioFileId, genreId, userId].some((field) => field === undefined || field === null)
        ||
        price === undefined || price === null
    ) {
        throw new ApiError(401, "All fields are required");
    }

    if (forSale === false) {
        price = 0;
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
            },
            user: {
                connect: {
                    id: userId
                }
            },
            forSale: forSale,
            price: price
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

const findSongsByUserId = asyncHandler(async(req, res) => {
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(400, "User Id undefined");
    }

    const songs = await prisma.song.findMany({
        where: {
            userId
        }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                songs: songs
            },
            "Successfully Found Songs"
        )
    )
});

const findSongs = asyncHandler(async (req, res) => {
    const songs = await prisma.song.findMany({
        include: {
            audio_file: true,
            genre: true,
            user: {
                select: {
                    id: true,
                    display_name: true,
                }
            }
        },
        orderBy: {
            id: "desc"
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
        },
        include: {
            audio_file: true,
            genre: true,
            user: {
                select: { id: true, display_name: true }
            }
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
        },
        include: {
            audio_file: true,
            genre: true,
            user: {
                select: { id: true, display_name: true }
            }
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

// FIX: songId comes from req.query, which is always a string. This
// was crashing every request with "Expected Int, provided String".
const findSongById = asyncHandler(async(req, res) => {
    let { songId } = req.query;

    if (!songId) {
        throw new ApiError(400, "Song Id undefined");
    }

    const song = await prisma.song.findUnique({
        where: {
            id: parseInt(songId, 10)
        },
        include: {
            user: {
                select: { id: true, display_name: true }
            }
        }
    });

    if (!song) {
        throw new ApiError(500, "Error finding song");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                song: song
            },
            "Successfully found song"
        )
    );
});

export {
    createSong,
    findSongs,
    findSongsByGenreId,
    findSongsByTitle,
    findSongById,
    findSongsByUserId
}