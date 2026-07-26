import { Router } from "express";
import { 
    createStructuredReview,
    findStructuredReviewsBySongId
} from "../controllers/structuredreview.controller.js";

const router = Router();
router.route("/createStructuredReview").post(createStructuredReview);
router.route("/findStructuredReviewsBySongId").get(findStructuredReviewsBySongId);

export { router as structuredReviewRouter }