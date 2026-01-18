import User from "../model/User.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../utils/SecreteToken.js";

const SignUp = async (req, res, next) => {
  try {
    const { username, email, password, createdAt } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" , success: false});
    }

    const user = await User.create({ username, email, password, createdAt });
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({message: "User signed in successfully" , success: true});
    return;
  } catch (e) {
    console.log("Error occur during SignUp" + e);
  }
};


const LogIn = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "email not found" , success: false });
    }

    const auth = await bcrypt.compare(password , user.password);
    if(!auth) {
        return res.json({message: "Incorrect password, Try again..." , success: false})
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({message: "User logged in successfully" , success: true});
    return;
  } catch (e) {
    console.log("Error occur during Login" + e);
  }
};


const LogOut = (req , res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production
  });

  return res.json({ success: true });
};

export {SignUp , LogIn , LogOut};