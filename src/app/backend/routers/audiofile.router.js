import { Router } from "express";
import {
    createAudioFile,
    findAudioFileById
} from "../controllers/audiofile.controller.js";

const router = Router();
router.route("/createAudioFile").post(createAudioFile);
router.route("/findAudioFileById").get(findAudioFileById);

export { router as audioFileRouter }