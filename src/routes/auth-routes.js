import express from "express";
import { SignUp, login, verifyCode,
sendVerificationCode, resetPassword } from "../controllers/auth-controllers.js";

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     description: Register a new user
 *     parameters:
 *       - name: username
 *         in: body
 *         description: The username of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: email
 *         in: body
 *         description: The email address of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         description: The password for the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully registered user
 *       400:
 *         description: Invalid input
 */
router.post("/signup", SignUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Log in an existing user
 *     parameters:
 *       - name: email
 *         in: body
 *         description: The email address of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: password
 *         in: body
 *         description: The password of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Unauthorized, invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/send:
 *   post:
 *     description: Send a verification code to the user email
 *     parameters:
 *       - name: email
 *         in: body
 *         description: The email address of the user to send verification code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 *       400:
 *         description: Invalid email address
 */
router.post("/send", sendVerificationCode);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     description: Verify the sent verification code
 *     parameters:
 *       - name: email
 *         in: body
 *         description: The email address of the user
 *         required: true
 *         schema:
 *           type: string
 *       - name: code
 *         in: body
 *         description: The verification code to verify
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully verified the code
 *       400:
 *         description: Invalid verification code
 */
router.post("/verify", verifyCode);



/**
 * @swagger
 * /user/resetpassword:
 *   post:
 *     summary: Reset a user's password
 *     description: This endpoint allows a user to reset their password using their user ID and the new password. The password is hashed before updating in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user whose password is being reset.
 *                 example: 123
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully"
 *       400:
 *         description: Missing user ID or new password in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User id and new Password are required"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error. Something went wrong while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while resetting the password"
 */


router.put("/resetpassword", resetPassword)

export default router;
