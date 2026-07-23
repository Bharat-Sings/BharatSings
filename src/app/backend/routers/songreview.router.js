import { Router } from "express";
import {
    createSongReview,
    findSongReviewsBySongId
} from "../controllers/songreview.controller.js";

const router = Router();

router.route("/createSongReview").post(createSongReview);
router.route("/findSongReviewsBySongId").get(findSongReviewsBySongId);

export { router as songReviewRouter }