import express from "express";
import userVerification from "../middleware/AuthMiddleWare.js";
import { LogIn , SignUp } from "../controller/AuthController.js";

const router = express.Router();

router.post("/" , userVerification);

router.post("/login" , LogIn);

router.post("/signup" , SignUp);

export default router;