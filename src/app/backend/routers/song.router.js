import { Router } from "express";
import {
    createSong,
    findSongs,
    findSongsByGenreId,
    findSongsByTitle,
    findSongById
} from "../controllers/song.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createSong").post(authMiddleware, createSong);
router.route("/findSongs").get(findSongs);
router.route("/findSongsByGenreId").get(findSongsByGenreId);
router.route("/findSongsByTitle").get(findSongsByTitle);
router.route("/findSongById").get(findSongById);

export { router as songRouter }