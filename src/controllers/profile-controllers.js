import db from "../db/db.js";
import dotenv from "dotenv";

dotenv.config();

const checkIfUserExists = async (user_id, email) => {
    const checkCreatorProfile = await db.query(
        "SELECT * FROM creatorprofile WHERE user_id = $1 OR email = $2",
        [user_id, email]
    );

    if (checkCreatorProfile.rows.length > 0) {
        return { exists: true, table: 'creatorprofile' };
    }

    const checkUserProfile = await db.query(
        "SELECT * FROM userprofiles WHERE user_id = $1 OR email = $2",
        [user_id, email]
    );

    if (checkUserProfile.rows.length > 0) {
        return { exists: true, table: 'userprofiles' };
    }

    return { exists: false };
};

export const creatorProfile = async (req, res) => {
    const { user_id, name, phoneNo, address, brandName, email } = req.body;

    try {
        // First, check if the user already has a profile
        const userExists = await checkIfUserExists(user_id, email);

        if (userExists.exists) {
            return res.status(400).json({
                message: `User already has a profile`
            });
        }

        // Insert the new creator profile if no existing profile is found
        const saveInfo = await db.query(
            "INSERT INTO creatorprofile (user_id, name, phoneno, address, brandName, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_id, name, phoneNo, address, brandName, email]
        );

        if (saveInfo.rows && saveInfo.rows.length > 0) {
            const insertedCreator = saveInfo.rows[0];
            return res.status(200).json({
                message: "Profile created successfully",
                userInfo: insertedCreator
            });
        } else {
            return res.status(400).json({ message: "Profile not created" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const userProfile = async (req, res) => {
    const { user_id, name, phoneNo, address, email } = req.body;

    try {
        // First, check if the user already has a profile
        const userExists = await checkIfUserExists(user_id, email);

        if (userExists.exists) {
            return res.status(400).json({
                message: `User already has a profile`
            });
        }

        // Insert the new user profile if no existing profile is found
        const saveInfo = await db.query(
            "INSERT INTO userprofiles (user_id, name, phoneno, address, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [user_id, name, phoneNo, address, email]
        );

        if (saveInfo.rows && saveInfo.rows.length > 0) {
            const insertedUser = saveInfo.rows[0];
            return res.status(200).json({
                message: "Profile created successfully",
                userInfo: insertedUser
            });
        } else {
            return res.status(400).json({ message: "Profile not created" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const updateUserProfile = async (req, res) => {
    const { user_id, name, phoneNo, address, email } = req.body;

    if (!user_id || !name || !phoneNo || !address || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await db.query(
            `UPDATE users
             SET name = $1, phoneNo = $2, address = $3, email = $4
             WHERE user_id = $5 RETURNING *`,  
            [name, phoneNo, address, email, user_id]
        );
        if (result.rows.length > 0) {
            res.status(200).json({
                message: "Profile updated successfully",
                updatedUser: result.rows[0]
            });
        } else {
            res.status(400).json({ message: "User not found or update failed" });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
