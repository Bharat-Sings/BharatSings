import { Router } from "express";
import {
    createTrainer,
    findTrainers,
    findTrainersByCategory,
    findTrainersByName
} from "../controllers/trainer.controller.js";

const router = Router();

router.route("/createTrainer").post(createTrainer);
router.route("/findTrainers").get(findTrainers);
router.route("/findTrainersByCategory").get(findTrainersByCategory);
router.route("/findTrainerByName").get(findTrainersByName);

export { router as trainerRouter }