import express from "express";
import { SignUp, login, verifyCode, sendVerificationCode } from "../controllers/auth-controllers.js";



const router = express.Router()

router.post("/signup", SignUp)
router.post("login", login)
router.post("/send", sendVerificationCode)
router.post("/verify", verifyCode)




export default router;
