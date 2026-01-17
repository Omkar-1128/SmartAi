import User from "../model/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const userVerification = (req , res) => {
    console.log("Cookies received:", req.cookies);
    console.log("Headers:", req.headers.cookie);
    
    const token = req.cookies.token;
    if(!token) {
        console.log("No token found in cookies");
        return res.json({message: "token not found" , success: false})
    }

    console.log("Token found:", token.substring(0, 20) + "...");
    jwt.verify(token , process.env.SecreteKey , async(err , data) => {
        if(err) {
            console.log("JWT verification error:", err.message);
            return res.json({message: "Error occur during token verification" , success: false});
        } else {
            const user = await User.findById(data._id);
            if(user) {
                console.log("User verified successfully:", user.username);
                return res.json({message: "user verified successfully" , success: true , user: user.username});
            } else {
                console.log("User not found in database");
                return res.json({message: "user not found during verification" , success: false});
            }
        }
    } )
}

export default userVerification;

