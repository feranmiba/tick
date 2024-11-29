import e from "express";
import { creatorProfile, userProfile, updateUserProfile, updateCreatorProfile} from "../controllers/profile-controllers.js";

const router = e.Router();

/**
 * @swagger
 * /profile/creatorProfiles:
 *   post:
 *     description: Create a new creator profile
 *     parameters:
 *       - name: user_id
 *         in: body
 *         description: The unique identifier of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: name
 *         in: body
 *         description: The name of the creator
 *         required: true
 *         schema:
 *           type: string
 *       - name: phoneNo
 *         in: body
 *         description: The phone number of the creator
 *         required: true
 *         schema:
 *           type: string
 *       - name: address
 *         in: body
 *         description: The address of the creator
 *         required: false
 *         schema:
 *           type: string
 *       - name: brandName
 *         in: body
 *         description: The brand name associated with the creator
 *         required: false
 *         schema:
 *           type: string
 *       - name: email
 *         in: body
 *         description: The email address of the creator
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully created creator profile
 *       400:
 *         description: Invalid data provided
 */
router.post("/creatorProfiles", creatorProfile);

/**
 * @swagger
 * /profile/userProfiles:
 *   post:
 *     description: Create a new user profile
 *     parameters:
 *       - name: user_id
 *         in: body
 *         description: The unique identifier of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: name
 *         in: body
 *         description: The name of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: phoneNo
 *         in: body
 *         description: The phone number of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: address
 *         in: body
 *         description: The address of the user
 *         required: false
 *         schema:
 *           type: string
 *       - name: email
 *         in: body
 *         description: The email address of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully created user profile
 *       400:
 *         description: Invalid data provided
 */
router.post("/userProfiles", userProfile);


/**
 * @swagger
 * /profile/updateuser:
 *   put:
 *     description: Update a user profile by passing all the parameters again
 *     parameters:
 *       - name: user_id
 *         in: body
 *         description: The unique identifier of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: name
 *         in: body
 *         description: The name of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: phoneNo
 *         in: body
 *         description: The phone number of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: address
 *         in: body
 *         description: The address of the user
 *         required: false
 *         schema:
 *           type: string
 *       - name: email
 *         in: body
 *         description: The email address of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully created user profile
 *       400:
 *         description: Invalid data provided
 */
router.put("/updateuser", updateUserProfile);

/**
 * @swagger
 * /profile/updatecreator:
 *   put:
 *     description: Update a creator profile
 *     parameters:
 *       - name: user_id
 *         in: body
 *         description: The unique identifier of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: name
 *         in: body
 *         description: The name of the creator
 *         required: true
 *         schema:
 *           type: string
 *       - name: phoneNo
 *         in: body
 *         description: The phone number of the creator
 *         required: true
 *         schema:
 *           type: string
 *       - name: address
 *         in: body
 *         description: The address of the creator
 *         required: false
 *         schema:
 *           type: string
 *       - name: brandName
 *         in: body
 *         description: The brand name associated with the creator
 *         required: false
 *         schema:
 *           type: string
 *       - name: email
 *         in: body
 *         description: The email address of the creator
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully created creator profile
 *       400:
 *         description: Invalid data provided
 */

router.put("/updatecreator", updateCreatorProfile)


export default router;
