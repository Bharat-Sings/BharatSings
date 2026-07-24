import { Router } from "express";
import { 
    createCourseReview
} from "../controllers/coursereview.controller.js";

const router = Router();

router.route("/createCourseReview").post(createCourseReview);

export { router as courseReviewRouter }