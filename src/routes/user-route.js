import express from "express";
import { getInterest, getUserIntrestedEvents, addUserInterest } from "../controllers/user-controller.js";


const router = express.Router();

router.get("/interests", getInterest);
router.post("/interests", addUserInterest);
router.get("/events/:user_id", getUserIntrestedEvents);


export default router;