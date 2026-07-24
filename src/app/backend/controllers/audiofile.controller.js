import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

const createAudioFile = asyncHandler(async (req, res) => {
    let { url } = req.body;

    if (!url || url?.trim() === "") {
        throw new ApiError(401, "URL empty or undefined");
    }

    const audioFile = await prisma.audio_file.create({
        data: {
            url: url
        }
    });

    if (!audioFile) {
        throw new ApiError(500, "Error creating audio file");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                createdAudioFile: audioFile
            },
            "Successfully created audio file"
        )
    );
});

const findAudioFileById = asyncHandler(async(req, res) => {
    let { audioFileId } = req.query;

    if (!audioFileId) {
        throw new ApiError(401, "Audio File Id undefined");
    }

    const audioFile = await prisma.audio_file.findUnique({
        where: {
            id: parseInt(audioFileId)
        }
    });

    if (!audioFile) {
        throw new ApiError(500, "Error finding audio file");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                audioFile: audioFile
            },
            "Successfully found audio file"
        )
    );
});

export {
    createAudioFile,
    findAudioFileById
}