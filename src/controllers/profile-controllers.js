import db from "../db/db.js";
import dotenv from "dotenv"




export const creatorProfile = async ( req, res) => {

        const { user_id, name, phoneNo, address, brandName, email } = req.body
    try {
        const saveInfo = db.query("INSERT INTO creatorprofile (user_id, name, phoneNo, address, brandName, email), VALUES ($1, $2, $3, $4, $5)", [user_id, name, phoneNo, address, brandName, email ])

        if (saveInfo) {
            res.status(200).json({message: "profile created", userInfo: saveInfo})
        } else {
            res.status(400).json({message: "Profile not created"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error"})
    }
}


export const userProfile = async (req, res) => {
    const {user_id, name, phoneNo, address, email } = req.body

    try {
        const saveInfo = db.query("INSERT INTO userprofile (user_id, name, phoneNo, address, email), VALUES ($1, $2, $3, $4, $5)", [user_id, name, phoneNo, address, email])

        if (saveInfo) {
            res.status(200).json({message: "profile created", userInfo: saveInfo})
        } else {
            res.status(400).json({message: "Profile not created"})
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error"})
    }
}


dotenv.config()
