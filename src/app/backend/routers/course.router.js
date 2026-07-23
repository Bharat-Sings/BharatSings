import { Router } from "express";
import { 
    createCourse 
} from "../controllers/course.controller.js";

const router = Router();
router.route("/createCourse").post(createCourse);

export { router as courseRouter }