import { Router } from "express";
import { 
    createEnrollment,
    findEnrollmentsByCourseId,
    findEnrollmentsByUserId 
} from "../controllers/enrollment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createEnrollment").post(authMiddleware, createEnrollment);
router.route("/findEnrollmentsByCourseId").get(findEnrollmentsByCourseId);
router.route("/findEnrollmentsByUserId").get(authMiddleware, findEnrollmentsByUserId);

export { router as enrollmentRouter }