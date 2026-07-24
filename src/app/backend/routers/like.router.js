import { Router } from "express";
import {
    createLikeForComment,
    createLikeForSong
} from "../controllers/like.controller.js";

const router = Router();
router.route("/createLikeForComment").post(createLikeForComment);
router.route("/createLikeForSong").post(createLikeForSong);

export { router as likeRouter }