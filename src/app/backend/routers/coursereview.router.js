import { Router } from "express";
import { 
    createCourseReview,
    findCourseReviewsByCourseId
} from "../controllers/coursereview.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createCourseReview").post(authMiddleware, createCourseReview);
router.route("/findCourseReviewsByCourseId").get(findCourseReviewsByCourseId);

export { router as courseReviewRouter }