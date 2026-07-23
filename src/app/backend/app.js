import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routers/user.router.js";
import { songRouter } from "./routers/song.router.js";
import { courseRouter } from "./routers/course.router.js";
import { enrollmentRouter } from "./routers/enrollment.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({
    origin: process.env.FRONTEND_URI || "https://localhost:5000",
    credentials: true
}));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/songs", songRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/enrollments", enrollmentRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}....`);
})