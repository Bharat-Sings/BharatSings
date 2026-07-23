import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const prisma = new PrismaClient();

const createTrainer = asyncHandler(async (req, res) => {
    let { name, category, description } = req.body;

    if (
        [name, category, description].some((field) => !field || field?.trim() === "")
    ) {
        throw new ApiError(401, "All fields are necessary");
    }

    const trainer = await prisma.trainer.create({
        data: {
            name,
            category,
            description
        }
    });

    if (!trainer) {
        throw new ApiError(500, "Error creating trainer");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                createdTrainer: trainer
            },
            "Successfully created trainer"
        )
    )
});

const findTrainers = asyncHandler(async (req, res) => {
    const trainers = await prisma.trainer.findMany();

    if (!trainers) {
        throw new ApiError(500, "Error finding trainers");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                trainers: trainers
            },
            "Successfully found trainers"
        )
    );
});

const findTrainersByCategory = asyncHandler(async(req, res) => {
    let { category } = req.query;

    if (!category || category?.trim() === "") {
        throw new ApiError(401, "Category empty or undefined");
    }

    const trainers = await prisma.trainer.findMany({
        where: {
            category: category
        }
    });

    if (!trainers) {
        throw new ApiError(500, "Error finding trainers");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                trainers: trainers
            },
            "Successfully found trainers"
        )
    );
});

const findTrainersByName = asyncHandler(async(req, res) => {
    let { name } = req.query;

    if (!name || name?.trim() === "") {
        throw new ApiError(401, "Name empty or undefined");
    }

    const trainers = await prisma.trainer.findMany({
        where: {
            name: name
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                trainers: trainers
            },
            "Successfully found trainers"
        )
    );
});

export {
    createTrainer,
    findTrainers,
    findTrainersByCategory,
    findTrainersByName
}