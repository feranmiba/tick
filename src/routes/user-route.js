import express from "express";
import { getInterest, getUserIntrestedEvents, addUserInterest } from "../controllers/user-controller";


const router = express.Router();

router.get("/interests/:user_id", getInterest);
router.post("/interests", addUserInterest);
router.get("/events/:user_id", getUserIntrestedEvents);