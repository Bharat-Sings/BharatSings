import { Router } from "express";
import { 
    createCourse,
    findCourses,
    findCoursesByTitle,
    findCoursesByCategory,
    findCoursesByLanguage
} from "../controllers/course.controller.js";

const router = Router();
router.route("/createCourse").post(createCourse);
router.route("/findCourses").get(findCourses);
router.route("/findCoursesByTitle").get(findCoursesByTitle);
router.route("/findCoursesByCategory").get(findCoursesByCategory);
router.route("/findCoursesByLanguage").get(findCoursesByLanguage);

export { router as courseRouter }