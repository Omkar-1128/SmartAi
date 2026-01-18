import express from "express";
import userVerification from "../middleware/AuthMiddleWare.js";
import { LogIn , SignUp, LogOut } from "../controller/AuthController.js";

const router = express.Router();

router.post("/" , userVerification);

router.post("/login" , LogIn);

router.post("/signup" , SignUp);

router.post("/logout" , LogOut);

export default router;