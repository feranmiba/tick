import db from "../db/db.js";
import dotenv from "dotenv";
import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize Multer with storage settings and file size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 9 * 1024 * 1024 } // Set a 10MB file size limit
});

export default upload;



export const eventCreation = async  (req, res) => {

    const {brand_name, eventName, eventAddress, timeIn, timeOut, summary,  price, category, date} = req.body
    const picture = req.file ? req.file.path : null

    try {
        const saveInfo = db.query("INSERT INTO eventcreation (brand_name, eventName, eventAddress, timeIn, timeOut, summary, media, price, category, date), VALUES ($1, $2, $3, $4, $5, $6, $7)", [brand_name, eventName, eventAddress, timeIn, timeOut, summary, picture, price, category, date])

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


export const getAllEvent = async (req, res) => {
    try {
        const getEvent = await db.query("SELECT * FROM eventcreation")

        if(getEvent) {
            res.status(200).json({event: getEvent})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server error"})
    }
}
export const getEvent = async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const getEvent = await db.query("SELECT * FROM eventcreation WHERE id = $1", [ eventId ])

        if(getEvent) {
            res.status(200).json({event: getEvent})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server error"})
    }
}

 export const attendEvent = async (req, res) => {
    const { userId, eventId } = req.body;

    try {

        const result = await db.query(
            "INSERT INTO user_events (user_id, event_id) VALUES ($1, $2)",
            [userId, eventId]
        );

        res.status(200).json({ message: "Event attended successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getAttendedEvents = async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await db.query(
            `SELECT e.id, e.event_name, e.date, e.address, e.timeIn, e.timeOut
             FROM user_events ue
             JOIN eventcreation e ON ue.event_id = e.id
             WHERE ue.user_id = $1`,
            [userId]
        );

        if(result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(400).json({ message: "User has not attended any event"})
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const uploadMiddleware = upload.single('picture')

dotenv.config()
