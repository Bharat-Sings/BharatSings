import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({
    origin: process.env.FRONTEND_URI || "https://localhost:5000",
    credentials: true
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}....`);
})