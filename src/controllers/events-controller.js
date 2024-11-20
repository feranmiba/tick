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


export const getEvent = async (req, res) => {
    try {
        const getEvent = db.query("SELECT * FROM eventcreation")

        if(getEvent) {
            res.status(200).json({event: getEvent})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server error"})
    }
}


export const uploadMiddleware = upload.single('picture')

dotenv.config()
