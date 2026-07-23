import { Router } from "express";
import {

    register,
    login,
    refreshToken,
    logout,

} from "../controllers/user.controller.js";

import {

    registerValidation,
    loginValidation,

} from "../validators/auth.validator.js";



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
export { router as userRouter }