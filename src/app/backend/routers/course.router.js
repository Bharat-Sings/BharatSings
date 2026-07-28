import { Router } from "express";
import { 
    createCourse,
    findCourses,
    findCoursesByTitle,
    findCoursesByCategory,
    findCoursesByLanguage,
    findCoursesByTrainerId,
    deleteCourse,
    publishCourse
} from "../controllers/course.controller.js";
import trainerAuthMiddleware from "../middlewares/trainerauth.middleware.js";

const router = Router();
router.route("/createCourse").post(trainerAuthMiddleware, createCourse);
router.route("/findCourses").get(findCourses);
router.route("/findCoursesByTitle").get(findCoursesByTitle);
router.route("/findCoursesByCategory").get(findCoursesByCategory);
router.route("/findCoursesByLanguage").get(findCoursesByLanguage);
router.route("/findCoursesByTrainerId").get(findCoursesByTrainerId);
router.route("/deleteCourse").delete(trainerAuthMiddleware, deleteCourse);
router.route("/publishCourse").patch(publishCourse);

export { router as courseRouter }