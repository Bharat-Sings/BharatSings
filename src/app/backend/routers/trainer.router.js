import { Router } from "express";
import {
    registerTrainer,
    loginTrainer,
    refreshTrainerToken,
    logoutTrainer,
    getCurrentTrainer,
    findTrainers,
    findTrainersByCategory,
    findTrainersByName
} from "../controllers/trainer.controller.js";
import trainerAuthMiddleware from "../middlewares/trainerAuth.middleware.js";

const router = Router();

router.route("/registerTrainer").post(registerTrainer);
router.route("/loginTrainer").post(loginTrainer);
router.route("/logoutTrainer").post(logoutTrainer);
router.route("/refreshTrainerToken").post(refreshTrainerToken);
router.route("/me").get(trainerAuthMiddleware, getCurrentTrainer);
router.route("/findTrainers").get(findTrainers);
router.route("/findTrainersByCategory").get(findTrainersByCategory);
router.route("/findTrainerByName").get(findTrainersByName);

export { router as trainerRouter }