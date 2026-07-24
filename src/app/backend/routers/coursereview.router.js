import { Router } from "express";
import { 
    createCourseReview,
    findCourseReviewsByCourseId
} from "../controllers/coursereview.controller.js";

const router = Router();

router.route("/createCourseReview").post(createCourseReview);
router.route("/findCourseReviewsByCourseId").get(findCourseReviewsByCourseId);

export { router as courseReviewRouter }