import e from "express";
import { eventCreation, uploadMiddleware } from "../controllers/events-controller.js";
import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
      }
    });

    const upload = multer({ storage: storage });

const router = e.Router()

/**
 * @swagger
 * /event:
 *   post:
 *     description: Create a new event with details and media upload
 *     parameters:
 *       - name: brand_name
 *         in: formData
 *         description: The name of the event's brand or organizer
 *         required: true
 *         type: string
 *       - name: eventName
 *         in: formData
 *         description: The name of the event
 *         required: true
 *         type: string
 *       - name: eventAddress
 *         in: formData
 *         description: The physical address where the event will take place
 *         required: true
 *         type: string
 *       - name: timeIn
 *         in: formData
 *         description: The start date and time of the event
 *         required: true
 *         type: string
 *         format: date-time
 *       - name: timeOut
 *         in: formData
 *         description: The end date and time of the event
 *         required: true
 *         type: string
 *         format: date-time
 *       - name: summary
 *         in: formData
 *         description: A brief summary of the event
 *         required: true
 *         type: string
 *       - name: picture
 *         in: formData
 *         description: A Single picture not more than 10mb
 *         required: true
 *         type: string
 *       - name: price
 *         in: formData
 *         description: The price to attend the event
 *         required: true
 *         type: number
 *         format: float
 *       - name: category
 *         in: formData
 *         description: The category or type of event (e.g., conference, concert)
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Event successfully created
 *       400:
 *         description: Invalid data provided
 */
router.post("/event", uploadMiddleware, eventCreation)


export default router
