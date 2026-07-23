import { body } from "express-validator";

export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("display_name")
    .notEmpty()
    .withMessage("Display name is required"),

  body("gender")
    .optional()
    .isString(),

  body("country")
    .optional()
    .isString(),

  body("bio")
    .optional()
    .isString(),

  body("date_of_birth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date"),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .notEmpty()
    .withMessage("Password required"),
];