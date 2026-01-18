import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import testRoute from "./Routes/chat.js";
import authRoutes from "./Routes/AuthRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();


app.use(
  cors({
    origin: ["http://localhost:5173" , "https://superb-pastelito-2a1e81.netlify.app"],   // <-- Frontend URL here
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); 

const PORT = 8080;
app.listen(PORT, (req, res) => {
  console.log(`Listening on port ${PORT}`);
  ConnectDB();
});

// Creating DataBase Connetion
const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("DataBase Connected Successfully...")
    } catch (e) {
        console.error("Database connection error:", e.message);
    }
}

app.use("/api" , testRoute)
app.use("/api" , authRoutes)
