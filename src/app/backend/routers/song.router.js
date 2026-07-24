import { Router } from "express";
import {
    createSong,
    findSongs,
    findSongsByGenreId,
    findSongsByTitle
} from "../controllers/song.controller.js";

const router = Router();

router.route("/createSong").post(createSong);
router.route("/findSongs").get(findSongs);
router.route("/findSongsByGenreId").get(findSongsByGenreId);
router.route("/findSongsByTitle").get(findSongsByTitle);

export { router as songRouter }