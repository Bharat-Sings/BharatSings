import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import ms from "ms";

import {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
} from "../utils/auth.utils.js";

const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY || "10d"),
};

const prisma = new PrismaClient();

const registerTrainer = async (req, res, next) => {
    try {
        let { name, email, password, category, description } = req.body;

        if (
            [name, email, password, category, description].some((field) => !field || field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are necessary");
        }

        const existingTrainer = await prisma.trainer.findUnique({
            where: {
                email: email
            }
        });

        if (existingTrainer) {
            throw new ApiError(409, "Trainer already exists");
        }

        const hashedPassword = await hashPassword(password);

        const trainer = await prisma.trainer.create({
            data: {
                name,
                email,
                password: hashedPassword,
                category,
                description,
                user_role: "trainer"
            }
        });

        if (!trainer) {
            throw new ApiError(500, "Error creating trainer");
        }

        const accessToken = generateAccessToken(trainer);
        const refreshToken = generateRefreshToken(trainer);

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshTokenCookieOptions
        );


        const { password: pwd, ...trainerData } = trainer;

        res.status(201).json({
            trainer: trainerData,
            accessToken,
        });
    } catch (err) {
        next(err);
    }
};

const loginTrainer = async (req, res, next) => {
    try {
        let {
            email,
            password
        } = req.body;

        if (
            [email, password].some((field) => !field || field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required");
        }

        const trainer = await prisma.trainer.findUnique({
            where: {
                email: email
            }
        });

        if (!trainer) {
            throw new ApiError(404, "Trainer not found");
        }

        const isMatch = await comparePassword(
            password,
            trainer.password
        );

        if (!isMatch) {
            throw new ApiError(401, "Invalid Credentials");
        }

        if (!user.is_active) {

            return res.status(403).json({
                message: "Account disabled",
            });

        }

        const accessToken = generateAccessToken(trainer);
        const refreshToken = generateRefreshToken(trainer);

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshTokenCookieOptions
        )

        const { password: pwd, ...trainerData } = trainer;

        res.json({
            trainer: trainerData,
            accessToken,
        })
    } catch (err) {
        next(err);
    }
}

const refreshTrainerToken = async(req, res, next) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {

            return res.status(401).json({
                message: "Refresh token missing",
            });

        }

        const decoded = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET
        );

        const trainer = await prisma.trainer.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                email: true,
                user_role: true,
                is_active: true
            }
        })

        if (!trainer || !trainer.is_active) {
            throw new ApiError(401, "Trainer Not Found");
        }

        const accessToken = generateAccessToken(trainer);
        const refreshToken = generateRefreshToken(trainer);

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshTokenCookieOptions
        )

        res.json({
            accessToken,
        })
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Refresh Token"
        })
    }
}

const logoutTrainer = async (req, res) => {

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });

    res.json({
        message: "Logged out successfully",
    });

};

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

const getCurrentTrainer = async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                trainer: req.trainer,
            },
            "Current trainer fetched successfully"
        )
    );
};

export {
    registerTrainer,
    loginTrainer,
    refreshTrainerToken,
    logoutTrainer,
    getCurrentTrainer,
    findTrainers,
    findTrainersByCategory,
    findTrainersByName
}