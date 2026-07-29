import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routers/user.router.js";
import { songRouter } from "./routers/song.router.js";
import { courseRouter } from "./routers/course.router.js";
import { enrollmentRouter } from "./routers/enrollment.router.js";
import { trainerRouter } from "./routers/trainer.router.js";
import { songReviewRouter } from "./routers/songreview.router.js";
import { audioFileRouter } from "./routers/audiofile.router.js";
import { albumRouter } from "./routers/album.router.js";
import { likeRouter } from "./routers/like.router.js";
import { courseReviewRouter } from "./routers/coursereview.router.js";
import { structuredReviewRouter } from "./routers/structuredreview.router.js";
import { videoRouter } from "./routers/video.router.js";
import { screenshotRouter } from "./routers/screenshot.router.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({
    origin: process.env.FRONTEND_URI || "http://localhost:3000",
    credentials: true
}));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/songs", songRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/enrollments", enrollmentRouter);
app.use("/api/v1/trainers", trainerRouter);
app.use("/api/v1/songreviews", songReviewRouter);
app.use("/api/v1/audiofiles", audioFileRouter);
app.use("/api/v1/albums", albumRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/coursereviews", courseReviewRouter);
app.use("/api/v1/structuredreviews", structuredReviewRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/screenshots", screenshotRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}....`);
})