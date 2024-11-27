import db from "../db/db.js";
import dotenv from "dotenv";
import multer from "multer";
import { sendEmail } from "../utils/email-service.js";


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
    limits: { fileSize: 9 * 1024 * 1024 }
});

export default upload;



export const eventCreation = async  (req, res) => {

    const {brand_name, eventName, eventAddress, timeIn, timeOut, summary,  price, category, date, account_name, account_number, bank} = req.body
    const picture = req.file ? req.file.path : null

    try {
        const saveInfo = await db.query(
            "INSERT INTO eventcreation (brand_name, event_name, event_address, time_in, time_out, summary, picture, price, category, date, account_name, account_number, bank) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
            [brand_name, eventName, eventAddress, timeIn, timeOut, summary, picture, price, category, date, account_name, account_number, bank]
        );
        if (saveInfo) {
            res.status(200).json({message: "profile created", userInfo: saveInfo.rows})
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
            res.status(200).json({event: getEvent.rows})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server error"})
    }
}
export const getEvent = async (req, res) => {
    const eventId = req.query.eventId;
    try {
        const getEvent = await db.query("SELECT * FROM eventcreation WHERE id = $1", [ eventId ])

        if(getEvent) {
            res.status(200).json({event: getEvent.rows})
            console.log(getEvent)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server error"})
    }
}

export const attendEvent = async (req, res) => {
    const { userId, eventId, email, qrcodeURL, token } = req.body;

    try {
        const result = await db.query(
            "INSERT INTO user_events (user_id, event_id, email, qrcode_url, token) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, eventId, email, qrcodeURL, token]
        );

        // Make sure result.rows contains at least one row (i.e., check if the insert was successful)
        if (result.rows.length > 0) {
            const userId = result.rows[0].user_id;
            const eventID = result.rows[0].event_id;
            const qrcode_url = result.rows[0].qrcode_url;
            const eventToken = result.rows[0].token;
            const userEmail = result.rows[0].email;

            const userNameResult = await db.query("SELECT name FROM userprofiles WHERE user_id = $1", [userId]);
            const eventResult = await db.query("SELECT event_name, picture FROM eventcreation WHERE id = $1", [eventID]);

            if (userNameResult.rows.length > 0 && eventResult.rows.length > 0) {
                const userName = userNameResult.rows[0].name;
                const eventName = eventResult.rows[0].event_name;
                const eventPic = eventResult.rows[0].picture;

                console.log("User Name: ", userName);
                console.log("Event Name: ", eventName);

                // Prepare the email content
                const text = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Event Payment Success</title>
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
                        h1 { color: #4CAF50; }
                        img { width: 300px; }
                        ul { padding-left: 20px; }
                        li { margin: 5px 0; }
                    </style>
                </head>
                <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
                    <p>Hello ${userName},</p>
                    <p>You have successfully paid for the event: <strong>${eventName}</strong>.</p>
                    <div>
                        <img src="${eventPic}" alt="${eventName} Picture" style="width: 300px;"/>
                    </div>
                    <ul>
                        <li>Your Token for the event: ${eventToken}</li>
                        <li>Your QR code for the event: <a href="${qrcode_url}" style="color: #1a73e8;">${qrcode_url}</a></li>
                    </ul>
                    <div>
                        Thanks for choosing Owl event website.
                        <h1>Enjoy your event!</h1>
                    </div>
                </body>
                </html>
                `;

                const subject = "THE OWL INITIATORS: Payment Successful";

                // Send the email asynchronously
                await sendEmail(userEmail, text, subject);

                // Send the response only after the email has been sent
                return res.status(200).json({ message: "Event attended successfully" });
            } else {
                // If user or event not found in database
                return res.status(404).json({ error: "User or Event not found" });
            }
        } else {
            // If the insert into user_events fails
            return res.status(400).json({ error: "Failed to attend event" });
        }
    } catch (error) {
        console.error("Error attending event:", error);
        // Send a generic error response if something goes wrong
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const getAttendedEvents = async (req, res) => {
    const userId = req.query.userId;

    try {

        const result = await db.query(
            `SELECT e.id, e.event_name, e.date, e.event_address, e.time_in, e.time_out, e.price, e.category, e.picture
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

export const getEventCreated = async (req, res) => {
    const brand_name = String(req.query.brand);
    try {
        console.log(brand_name)
        const result =  await db.query(`SELECT * FROM eventcreation WHERE brand_name = $1`, [brand_name]);

        if(result.rows.length > 0) {
            res.status(200).json(result.rows)
        } else {
            res.status(400).json({ message: "User has not create any event" })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal server error" })
    }
}


export const getEventBycategory = async (req, res) => {
    const category = req.params.category;
    try {
        const getEvent = await db.query("SELECT * FROM eventcreation WHERE category = $1", [ category ])

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
