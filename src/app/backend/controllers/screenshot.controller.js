import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { connect } from "mongoose";

const prisma = new PrismaClient();

const createScreenshot = asyncHandler(async(req, res) => {
    const { file_path } = req.body;

    if (!file_path || file_path?.trim() === "") {
        throw new ApiError(400, "File Path Empty or Undefined");
    }

    const existingScreenshot = await prisma.screenshot.findUnique({
        where: {
            file_path
        }
    });

    if (existingScreenshot) {
        throw new ApiError(409, "Screenshot Already Exists at this file path");
    }

    const screenshot = await prisma.screenshot.create({
        data: {
            file_path
        }
    });

    if (!screenshot) {
        throw new ApiError(500, "Error Creating Screenshot");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                screenshot
            },
            "Successfully Created Screenshot"
        )
    )
});

export {
    createScreenshot
}