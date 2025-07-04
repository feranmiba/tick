import db from "../db/db.js";
import dotenv from "dotenv";
import { userInterest } from "../utils/interest.js";

dotenv.config();

export const getInterest = async (req, res) => {
    try {
        const interests = Object.values(userInterest);

        if (interests.length > 0) {
            return res.status(200).json({
                message: "Interests retrieved successfully",
                interests: interests
            });
        } else {
            return res.status(404).json({ message: "No interests found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}


export const addUserInterest = async (req, res) => {
    const { user_id, interests } = req.body;

    try {
        const existingInterests = await db.query(
            "SELECT * FROM user_interests WHERE user_id = $1",
            [user_id]
        );

        if (existingInterests.rows.length > 0) {
            return res.status(400).json({
                message: "User already has interests"
            });
        }

        const insertQuery = `
            INSERT INTO user_interests (user_id, interests)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [user_id, JSON.stringify(interests)];

        const saveInfo = await db.query(insertQuery, values);

        if (saveInfo.rows && saveInfo.rows.length > 0) {
            return res.status(200).json({
                message: "Interests added successfully",
                userInterests: saveInfo.rows[0]
            });
        } else {
            return res.status(400).json({ message: "Failed to add interests" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const getUserIntrestedEvents = async (req, res) => {
    const { user_id } = req.params;

    try {
        const query = `
            SELECT e.*
            FROM events e
            JOIN user_interests ui ON e.interest = ANY(ui.interests)
            WHERE ui.user_id = $1;
        `;
        const result = await db.query(query, [user_id]);

        if (result.rows.length > 0) {
            return res.status(200).json({
                message: "User interested events retrieved successfully",
                events: result.rows
            });
        } else {
            return res.status(404).json({ message: "No interested events found for this user" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}