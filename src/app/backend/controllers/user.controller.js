import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import ms from "ms";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";

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

// REGISTER
export const register = async (req, res, next) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array(),
            });
        }

        const {
            email,
            password,
            display_name,
            date_of_birth,
            gender,
            country,
            bio,
        } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({

            data: {

                email,
                password: hashedPassword,
                display_name,
                profile_picture: "",
                bio: bio || "",
                date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
                gender: gender || "",
                country: country || "",
                user_role: "user",
                is_active: true,

            },

        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshTokenCookieOptions
        );

        const { password: pwd, ...userData } = user;

        res.status(201).json({
            user: userData,
            accessToken,
        });

    } catch (err) {
        next(err);
    }
};

// LOGIN
export const login = async (req, res, next) => {

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(422).json({
                errors: errors.array(),
            });

        }

        const {
            email,
            password,
        } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid credentials",
            });

        }

        if (!user.is_active) {

            return res.status(403).json({
                message: "Account disabled",
            });

        }

        const isMatch = await comparePassword(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid credentials",
            });

        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshTokenCookieOptions
        );

        const { password: pwd, ...userData } = user;

        res.json({

            user: userData,
            accessToken,

        });

    } catch (err) {
        next(err);
    }

};

// REFRESH TOKEN
export const refreshToken = async (req, res, next) => {

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

        const user = await prisma.user.findUnique({

            where: {
                id: decoded.userId,
            },

            select: {
                id: true,
                email: true,
                user_role: true,
                is_active: true,
            },

        });

        if (!user || !user.is_active) {

            return res.status(401).json({
                message: "User not found",
            });

        }

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        res.cookie(
            "refreshToken",
            refreshToken,
            refreshTokenCookieOptions
        );

        res.json({
            accessToken,
        });

    } catch (err) {

        return res.status(401).json({
            message: "Invalid refresh token",
        });

    }

};

// LOGOUT
export const logout = async (req, res) => {

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

//GET CURRENT USER
export const getCurrentUser = async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: req.user
            },
            "Current user fetched successfully"
        )
    );
};