import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { connect } from "mongoose";

const prisma = new PrismaClient();

const createAlbum = asyncHandler(async(req, res) => {
    let { title, description, artistId } = req.body;

    if (
        [title, description].some((field) => !field || field?.trim() === "")
        ||
        !artistId
    ) {
        throw new ApiError(401, "All fields are necessary");
    }

    const album = await prisma.album.create({
        data: {
            title,
            description,
            artist: {
                connect: {
                    id: artistId
                }
            }
        }
    });

    if (!album) {
        throw new ApiError(500, "Error creating album");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                createdAlbum: album
            },
            "Successfully created album"
        )
    );
});

const addSongToAlbum = asyncHandler(async (req, res) => {
    let { songId, albumId } = req.body;

    if (
        [songId, albumId].some((field) => !field)
    ) {
        throw new ApiError(401, "Song Id undefined");
    }

    const album = await prisma.album.findUnique({
        where: {
            id: albumId
        }
    });

    const song = await prisma.song.findUnique({
        where: {
            id: songId
        }
    });

    if (
        [album, song].some((field) => !field)
    ) {
        throw new ApiError(500, "Error adding song to album");
    }

    if (song.albumId) {
        throw new ApiError(400, "Song already belongs to an album");
    }

    const updatedSong = await prisma.song.update({
        where: {
            id: songId
        },
        data: {
            album: {
                connect: {
                    id: albumId
                }
            }
        }
    })

    if (!updatedSong) {
        throw new ApiError(500, "Error adding song to album");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                addedSong: updatedSong
            },
            "Successfully added song to album"
        )
    );
});

const findSongsInAlbum = asyncHandler(async (req, res) => {
    let { albumId } = req.body;

    if (!albumId) {
        throw new ApiError(400, "Album Id undefined");
    }

    const songs = await prisma.song.findMany({
        where: {
            albumId: albumId
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
            "Successfully Found Songs"
        )
    );
});

export {
    createAlbum,
    addSongToAlbum,
    findSongsInAlbum
}