import { Router } from "express";
import { createEnrollment } from "../controllers/enrollment.controller.js";

const router = Router();

router.route("/createEnrollment").post(createEnrollment);

export { router as enrollmentRouter }