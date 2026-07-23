import { Router } from "express";
import { 
    createEnrollment,
    findEnrollmentsByCourseId,
    findEnrollmentsByUserId 
} from "../controllers/enrollment.controller.js";

const router = Router();

router.route("/createEnrollment").post(createEnrollment);
router.route("/findEnrollmentsByCourseId").get(findEnrollmentsByCourseId);
router.route("/findEnrollmentsByUserId").get(findEnrollmentsByUserId);

export { router as enrollmentRouter }