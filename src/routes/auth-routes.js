import express from "express";
import { SignUp, login, verifyCode, sendVerificationCode } from "../controllers/auth-controllers.js";

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

export default router;
