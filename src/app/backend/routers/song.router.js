import { Router } from "express";
import {
    createSong,
    findSongs,
    findSongsByGenre,
    findSongsByTitle
} from "../controllers/song.controller.js";

const router = Router();

router.route("/createSong").post(createSong);
router.route("/findSongs").get(findSongs);
router.route("/findSongsByGenre").get(findSongsByGenre);
router.route("/findSongsByTitle").get(findSongsByTitle);

export { router as songRouter }