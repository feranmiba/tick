import db from "../db/db.js";
import dotenv from "dotenv";
import multer from "multer";
import { sendEmail } from "../utils/email-service.js";
import { generateTicketImage } from "../utils/generateTicketImage.js";





  

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

    const {brand_name, eventName, eventAddress, timeIn, timeOut, summary,  price, category, date, account_name, account_number, bank, vip, vvip, table_price, vvvip_price} = req.body
    const picture = req.file ? req.file.path : null

    try {
        const saveInfo = await db.query(
            "INSERT INTO eventcreation (brand_name, event_name, event_address, time_in, time_out, summary, picture, price, category, date, account_name, account_number, bank, vip_price, vvip_price, table_price, vvvip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *",
            [brand_name, eventName, eventAddress, timeIn, timeOut, summary, picture, price, category, date, account_name, account_number, bank, vip, vvip, table_price, vvvip_price]
        );
        if (saveInfo) {
            res.status(200).json({message: "Event Created", userInfo: saveInfo.rows})
        } else {
            res.status(400).json({message: "Event not created"})
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server error"})
    }
}
export const tableCreation = async (req, res) => {
    const { event_name, tables } = req.body;
    
    if (!Array.isArray(tables) || tables.length === 0) {
        return res.status(400).json({ message: "No tables provided" });
    }

    try {
        const insertValues = [];
        const valuePlaceholders = [];

        tables.forEach((table, index) => {
            const i = index * 3;
            insertValues.push(event_name, table.tableName, table.tablePrice, table.tableCapacity);
            valuePlaceholders.push(`($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4})`);
        });

        const query = `
            INSERT INTO table_categories (event_name, name, price, capacity)
            VALUES ${valuePlaceholders.join(", ")}
            RETURNING *;
        `;

        const result = await db.query(query, insertValues);

        return res.status(200).json({
            message: `${result.rowCount} table(s) created`,
            tableInfo: result.rows,
        });

    } catch (error) {
        console.error("Error creating tables:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const updateTableCreation = async (req, res) => {
    const { tables } = req.body;

    if (!Array.isArray(tables) || tables.length === 0) {
        return res.status(400).json({ message: "No tables provided for update" });
    }

    try {
        const updatedTables = [];

        for (const table of tables) {
            const { id, tableName, tablePrice, tableCapacity } = table;

            if (!id || !tableName || tablePrice == null || tableCapacity == null) {
                return res.status(400).json({ message: "Missing fields in one or more tables" });
            }

            const query = `
                UPDATE table_categories
                SET name = $1, price = $2, capacity = $3
                WHERE id = $4
                RETURNING *;
            `;

            const values = [tableName, tablePrice, tableCapacity, id];

            const result = await db.query(query, values);
            if (result.rowCount > 0) {
                updatedTables.push(result.rows[0]);
            }
        }

        return res.status(200).json({
            message: `${updatedTables.length} table(s) updated successfully`,
            updatedTables,
        });

    } catch (error) {
        console.error("Error updating tables:", error);
        return res.status(500).json({ error: "Server error during update" });
    }
};




export const DeleteEvent = async (req, res) => {
    const eventId = req.query.eventId; // Ensure eventId is passed in query parameters
    try {
        // Check if the event exists
        const getEvent = await db.query("SELECT * FROM eventcreation WHERE id = $1", [eventId]);

        if (getEvent.rowCount === 0) { // Use rowCount to check if the event exists
            return res.status(404).json({ message: "Event not available" });
        }

        // Delete the event
        const deleteEvent = await db.query("DELETE FROM eventcreation WHERE id = $1", [eventId]);
        if (deleteEvent.rowCount > 0) { // Check if rows were affected
            return res.status(200).json({ message: "Event Deleted Successfully" });
        } else {
            return res.status(400).json({ message: "Failed to delete the event" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



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
        const getEvent = await db.query("SELECT * FROM eventcreation WHERE id = $1", [eventId]);

        if (getEvent.rows.length === 0) {
            return res.status(404).json({ error: "Event not found" });
        }

        const getTable = await db.query(
            "SELECT * FROM table_categories WHERE event_name = $1",
            [getEvent.rows[0].event_name]
        );

        if (getTable.rows.length > 0) {
            return res.status(200).json({ event: getEvent.rows[0], table: getTable.rows });
        } else {
            return res.status(200).json({ event: getEvent.rows[0] });
        }

    } catch (error) {
        console.error("Error fetching event:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


export const attendEvent = async (req, res) => {
    const { userId, eventId, email, qrcodeURL, token, ticketType } = req.body;

    try {
        const result = await db.query(
            "INSERT INTO user_events (user_id, event_id, email, qrcode_url, token, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userId, eventId, email, qrcodeURL, token, ticketType]
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
                const eventDate = eventResult.rows[0].date;
                const eventTime = eventResult.rows[0].time_in;
                const eventLocation = eventResult.rows[0].event_address;
                
                const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <title>Event Payment Success</title>
                  <style>
                    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; }
                    h1 { color: #4CAF50; }
                    img { max-width: 100%; }
                    ul { padding-left: 20px; }
                    li { margin: 5px 0; }
                  </style>
                </head>
                <body>
                  <p>Hello ${userName},</p>
                  <p>You have successfully paid for the event: <strong>${eventName}</strong>.</p>
                  <div>
                    <img src="https://app.swiftjobs.com.ng/${eventPic}" alt="${eventName} Picture" style="width: 300px;" />
                  </div>
                  <ul>
                    <li>Your Token: ${eventToken}</li>
                    <li>Your QR Code: <a href="${qrcode_url}" style="color: #1a73e8;">${qrcode_url}</a></li>
                  </ul>
                  <h3>Your Ticket:</h3>
                  <img src="cid:ticketImage@owl" alt="Your Ticket" style="max-width: 400px; border: 1px solid #ccc; border-radius: 8px;" />
                  <p>Thanks for choosing Owl event website.</p>
                  <h1>Enjoy your event!</h1>
                </body>
                </html>
                `;
                
                const ticketImageBuffer = await generateTicketImage({
                  userName,
                  eventName,
                  eventToken,
                  qrcodeURL,
                  eventPic,
                  eventDate,
                  eventTime,
                  eventLocation
                });
                
                await sendEmail(userEmail, htmlContent, "THE OWL INITIATORS: Payment Successful", [
                  {
                    filename: 'ticket.png',
                    content: ticketImageBuffer,
                    contentType: 'image/png',
                    cid: 'ticketImage@owl',
                  }
                ]);
            

                return res.status(200).json({ message: "Event attended successfully" });
            } else {
                return res.status(404).json({ error: "User or Event not found" });
            }
        } else {
            return res.status(400).json({ error: "Failed to attend event" });
        }
    } catch (error) {
        console.error("Error attending event:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteTicket = async (req, res) => {
    const { token } = req.body;

    try {

        const searchToken = await db.query("SELECT * FROM user_events WHERE token = $1", [ token ])

        if (searchToken.rows.length > 0) {
            const deleteToken = await db.query("DELETE FROM user_events WHERE token = $1", [ token ])

        res.status(200).json({
            message: "Token deleted successfully"
        })
        } else {
            res.status(400).json({
                message: "Token not found or invalid token"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error. Please try again Later"
        })
    }

}

export const verifyToken = async (req, res) => {
    const { token } = req.body;

    try {
        const search = await db.query("SELECT * FROM user_events WHERE token = $1", [ token ])
        if (search.rows) {
            const user_id = search.rows[0].user_id
            const event_id = search.rows[0].event_id

            //SEARCH FOR THE USER DETAILS AND EVENT DETAILS USING THE EVENT ID AND USER ID
            const user = await db.query("SELECT * FROM userprofiles WHERE user_id = $1", [user_id]);
           const eventDetails =  await db.query("SELECT * FROM eventcreation WHERE id = $1", [event_id]);

           res.status(200).json({
            message: "Token Verified successfully",
            userProfile : user.rows[0],
            eventDetails: eventDetails.rows[0]
           })
        } else {
            res.status(400).json({
                message: "Token is not valid"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error. Please try again later"
        })
    }
}


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


export const getAttendee = async (req, res) => { 
    const{ eventId }= req.body
    try {
        const getAttendee = await db.query("SELECT * FROM user_events WHERE event_id = $1", [ eventId ])

        if(getAttendee) {
            res.status(200).json({event: getAttendee.rows})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server error"})
    }
}


export const updateEVent = async (req, res) => {
    const { eventId, brand_name, eventName, eventAddress, timeIn, timeOut, summary, price, category, date, account_name, account_number, bank, vip_price, vvip_price, table_price, vvvip } = req.body;
    const picture = req.file ? req.file.path : null;

    try {
        const updateQuery = `
            UPDATE eventcreation
            SET brand_name = $1,
                event_name = $2,
                event_address = $3,
                time_in = $4,
                time_out = $5,
                summary = $6,
                picture = $7,
                price = $8,
                category = $9,
                date = $10,
                account_name = $11,
                account_number = $12,
                bank = $13,
                vip_price = $14,
                vvip_price = $15,
                table_price = $16,
                vvvip = $17
            WHERE id = $18
            RETURNING *;
        `;

        const values = [brand_name, eventName, eventAddress, timeIn, timeOut, summary, picture, price, category, date, account_name, account_number, bank, vip_price, vvip_price, table_price, vvvip, eventId];

        const result = await db.query(updateQuery, values);

        if (result.rows.length > 0) {
            res.status(200).json({ message: "Event updated successfully", updatedEvent: result.rows[0] });
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export const uploadMiddleware = upload.single('picture')

dotenv.config()
