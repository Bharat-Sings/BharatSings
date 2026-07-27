import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const trainerAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const trainer = await prisma.trainer.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        email: true,
        user_role: true,
        is_active: true,
      },
    });

    if (!trainer || !trainer.is_active) {
      return res.status(401).json({
        message: "Trainer not found",
      });
    }

    req.trainer = trainer;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid access token",
    });
  }
};

export default trainerAuthMiddleware;