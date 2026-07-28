import { Router } from "express";
import { 
    createCourse,
    findCourses,
    findCoursesByTitle,
    findCoursesByCategory,
    findCoursesByLanguage,
    findCoursesByTrainerId,
    deleteCourse
} from "../controllers/course.controller.js";

const router = Router();
router.route("/createCourse").post(createCourse);
router.route("/findCourses").get(findCourses);
router.route("/findCoursesByTitle").get(findCoursesByTitle);
router.route("/findCoursesByCategory").get(findCoursesByCategory);
router.route("/findCoursesByLanguage").get(findCoursesByLanguage);
router.route("/findCoursesByTrainerId").get(findCoursesByTrainerId);
router.route("/deleteCourse").delete(deleteCourse);

export { router as courseRouter }