import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import testRoute from "./Routes/chat.js";
import Thread from "./model/Thread.js";
import authRoutes from "./Routes/AuthRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser()); 

const PORT = 8080;
app.listen(PORT, (req, res) => {
  console.log(`Listening on port ${PORT}`);
  ConnectDB();
});

app.use("/api" , testRoute)
app.use("/api" , authRoutes)

// Creating DataBase Connetion
const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("DataBase Connected Successfully...")
    } catch (e) {
        console.error("Database connection error:", e.message);
    }
}