import e from "express";
import { eventCreation, uploadMiddleware, getEvent } from "../controllers/events-controller.js";
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
 *       - name: date
 *         in: formData
 *         description: The date of the event
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Event successfully created
 *       400:
 *         description: Invalid data provided
 */
router.post("/event", uploadMiddleware, eventCreation)


/**
 * @swagger
 * /getEvent
 *  get:
 *  description: Get all the event
 *  responses:
 *  200:
 *  description: Successfully retrieved all the events
 *   content:
 *   application/json:
 *   schema:
 *   type: array
 *   items:
 *   type: object
 *   properties:
 *   id:
 *    type: integer
 *    description: The event ID
 *    event_name:
 *     type: string
 *     description: The name of the event
 *   date:
 *    type: string
 *    format: date
 *     description: The date of the event
 *   address:
 *    type:string
 *    description: The address of the event
 *   timeIn:
 *    type: string
 *    description: The start time for the event
 *   timeOut:
 *     type: string
 *     description: The end time for the event
 *   Price:
 *    type: string
 *    description: The Price for the event
 *   Category:
 *    type: string
 *    description: The category of the event
 *   Summary:
 *    type: string
 *    description: The ssummary the event
 *   brandName:
 *    type: string
 *    description: The owner of the event brand name
 *
 */

router.get("/getEvent", getEvent )


export default router
