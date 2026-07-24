import { Router } from "express";
import {

    register,
    login,
    refreshToken,
    logout,
    getCurrentUser

} from "../controllers/user.controller.js";

import {

    registerValidation,
    loginValidation,

} from "../validators/auth.validator.js";

import authMiddleware from "../middlewares/auth.middleware.js";


const router = Router();

router.post(
    "/register",
    registerValidation,
    register
);

router.post(
    "/login",
    loginValidation,
    login
);

router.post(
    "/refresh",
    refreshToken
);

router.post(
    "/logout",
    logout
);

router.get(
    "/me",
    authMiddleware,
    getCurrentUser
)

export { router as userRouter }