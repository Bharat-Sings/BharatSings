import { Router } from "express";
import {
    createLikeForComment,
    createLikeForSong,
    deleteLikeForSong,
    findLikesBySongId
} from "../controllers/like.controller.js";

const router = Router();
router.route("/createLikeForComment").post(createLikeForComment);
router.route("/createLikeForSong").post(createLikeForSong);
router.route("/deleteLikeForSong").post(deleteLikeForSong);
router.route("/findLikesBySongId").get(findLikesBySongId);

export { router as likeRouter }