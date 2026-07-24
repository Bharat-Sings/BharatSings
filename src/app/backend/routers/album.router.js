import { Router } from "express";
import {
    createAlbum,
    addSongToAlbum,
    findSongsInAlbum
} from "../controllers/album.controller.js";

const router = Router();

router.route("/createAlbum").post(createAlbum);
router.route("/addSongToAlbum").patch(addSongToAlbum);
router.route("/findSongsInAlbum").get(findSongsInAlbum);

export { router as albumRouter }