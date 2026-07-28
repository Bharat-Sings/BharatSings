import { Router } from "express";
import { 
    createVideo,
    findVideosByCourseId
} from "../controllers/video.controller.js";

const router = Router();

router.route("/createvideo").post(createVideo);
router.route("/findVideosByCourseId").get(findVideosByCourseId);

export { router as videoRouter }