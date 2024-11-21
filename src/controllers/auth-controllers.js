import dotenv from "dotenv"
import db from "../db/db.js";
import bcrypt from "bcrypt";
import NodeCache from "node-cache";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email-service.js";
import { generateRandomCode, generateAccessToken } from "../utils/jwt-service.js";


const saltRounds = 12

dotenv.config()


const cache = new NodeCache({ stdTTL: 300 });



export const SignUp = async (req, res) => {
    const details = req.body;

    console.log("Start sign-up process");
    console.log(details);

    try {
        // Check if the user already exists in the database
        const userExist = await db.query("SELECT * FROM user_credential WHERE email = $1", [details.email]);

        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: `User already exists with email ${details.email}.` });
        }

        console.log("User does not exist, proceeding with password hashing");

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(details.password, saltRounds);

        // Generate a verification code
        const code = generateRandomCode();

        // Send the verification code to the user's email
        await sendEmail(details.email, code);

        // Store the user's details (hashed password and code) in cache
        cache.set(details.email, { ...details, password: hashedPassword, code });

        // Respond with a success message
        res.status(200).json({ message: "A verification code has been sent to your email." });

    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    console.log("signIn attempt for:", email);

    try {
        // Check if the user exists in the user_credential table
        const usermailExist = await db.query("SELECT * FROM user_credential WHERE email = $1", [email]);

        if (usermailExist.rows.length > 0) {
            const user = usermailExist.rows[0];

            // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                // Fetch the user profile from the appropriate profile table(s)
                const creatorProfile = await db.query("SELECT * FROM creatorprofile WHERE user_id = $1", [user.id]);
                const attendeeProfile = await db.query("SELECT * FROM userprofile WHERE user_id = $1", [user.id]);

                let profile = null;

                // Choose the correct profile (creator or attendee)
                if (creatorProfile.rows.length > 0) {
                    profile = creatorProfile.rows[0];
                } else if (attendeeProfile.rows.length > 0) {
                    profile = attendeeProfile.rows[0];
                }

                if (profile) {
                    // Generate JWT token with user profile data
                    const accessToken = jwt.sign(profile, process.env.JWT_SECRET, { expiresIn: "20m" });

                    // Send the profile and access token as the response
                    return res.status(200).json({ userID: profile.user_id, accessToken: accessToken });
                } else {
                    return res.status(404).json({ message: "User profile not found." });
                }

            } else {
                // Password is incorrect
                return res.status(400).json({ message: "Incorrect password. Try again." });
            }
        } else {
            // User not found
            return res.status(404).json({ message: "User not found." });
        }

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
};



export const sendVerificationCode = async (req, res) => {
    const email = req.body.email;
    const code = generateRandomCode();

    cache.set(email, code);

    try {
        await sendEmail(email, code);
        res.status(200).send('Verification code sent');
    } catch (error) {
        console.error('Error sending email', error);
        res.status(500).send('Error sending email');
    }
};

export const verifyCode = async (req, res) => {
    const { email, code } = req.body;
    const cachedDetails = cache.get(email);

    if (!cachedDetails) {
        return res.status(400).json({ message: 'Invalid email or code' });
    }

    if (code === cachedDetails.code) {
        try {
         const response = await db.query(
                "INSERT INTO user_credential (username, email, password) VALUES ($1, $2, $3)",
                [ cachedDetails.username, cachedDetails.email, cachedDetails.password]
            );

            const accessToken = jwt.sign({ email: cachedDetails.email }, process.env.JWT_SECRET, { expiresIn: "20m" });
            cache.del(email);

            const userId = response.rows[0].id;

            return res.status(200).json({ profile: {
                user_id: userId,
                username: cachedDetails.user,
                email: cachedDetails.email,
            }, accessToken, message: 'Code verified and user registered successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error, please try again' });
        }
    }

    res.status(400).json({ message: 'Invalid code' });
};
