import e from "express";
import { creatorProfile , userProfile} from "../controllers/profile-controllers.js";


const router = e.Router()

router.post("/creatorProfiles", creatorProfile)
router.post("/userProfiles", userProfile)


export default router
