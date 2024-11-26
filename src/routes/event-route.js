import e from "express";
import { eventCreation, uploadMiddleware, getEvent, attendEvent, getAttendedEvents, getAllEvent, getEventCreated  } from "../controllers/events-controller.js";

const router = e.Router()

/**
 * @swagger
 * /event/event:
 *   post:
 *     description: Create a new event with details and media upload
 *     parameters:
 *       - name: brand_name
 *         in: formData
 *         description: The name of the event's brand or organizer
 *         required: true
 *         type: string
 *       - name: event_name
 *         in: formData
 *         description: The name of the event
 *         required: true
 *         type: string
 *       - name: event_address
 *         in: formData
 *         description: The physical address where the event will take place
 *         required: true
 *         type: string
 *       - name: time_in
 *         in: formData
 *         description: The start date and time of the event
 *         required: true
 *         type: string
 *         format: date-time
 *       - name: time_out
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
 * /event/getAllEvent:
 *   get:
 *     description: Get all the events
 *     responses:
 *       200:
 *         description: Successfully retrieved all the events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The event ID
 *                   event_name:
 *                     type: string
 *                     description: The name of the event
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the event
 *                   address:
 *                     type: string
 *                     description: The address of the event
 *                   time_in:
 *                     type: string
 *                     description: The start time for the event
 *                   time_out:
 *                     type: string
 *                     description: The end time for the event
 *                   price:
 *                     type: string
 *                     description: The price for the event
 *                   category:
 *                     type: string
 *                     description: The category of the event
 *                   summary:
 *                     type: string
 *                     description: A summary of the event
 *                   brandName:
 *                     type: string
 *                     description: The owner of the event brand name
 */

router.get("/getAllEvent", getAllEvent);

/**
 * @swagger
 * /event/attendEvent:
 *   post:
 *     summary: Allow a user to attend an event
 *     description: Adds an entry into the `user_events` table, marking that the user has attended a specific event.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user attending the event
 *                 example: 1
 *               eventId:
 *                 type: integer
 *                 description: The ID of the event that the user is attending
 *                 example: 5
 *     responses:
 *       200:
 *         description: Event attended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event attended successfully"
 *       400:
 *         description: Bad request, invalid userId or eventId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad request"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *
 * */
router.post("/attendEvent", attendEvent)

/**
 * @swagger
 *
 * /event/getAttendedEvents/{userId}:
 *   get:
 *     summary: Get all events attended by a specific user
 *     description: Fetches a list of events attended by the user, including event details such as name, date, and time.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose attended events you want to retrieve
 *         example: 1
 *     responses:
 *       200:
 *         description: A list of events the user has attended
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The event ID
 *                   event_name:
 *                     type: string
 *                     description: The name of the event
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the event
 *                   address:
 *                     type: string
 *                     description: The address of the event
 *                   timeIn:
 *                     type: string
 *                     description: The start time for the event
 *                   timeOut:
 *                     type: string
 *                     description: The end time for the event
 *       400:
 *         description: No events found or the user has not attended any events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User has not attended any event"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get("/getAttendedEvents", getAttendedEvents)

/**
 * @swagger
 * /event/getEvent/{eventId}:
 *   get:
 *     summary: Get event details by event ID
 *     description: Fetches the details of a specific event by its ID.
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the event to fetch
 *         example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the event
 *                       example: 5
 *                     event_name:
 *                       type: string
 *                       description: The name of the event
 *                       example: "Tech Conference"
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: The date of the event
 *                       example: "2024-12-01"
 *                     address:
 *                       type: string
 *                       description: The address where the event is held
 *                       example: "123 Tech Street, Silicon Valley"
 *                     timeIn:
 *                       type: string
 *                       description: The start time of the event
 *                       example: "09:00 AM"
 *                     timeOut:
 *                       type: string
 *                       description: The end time of the event
 *                       example: "05:00 PM"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */

router.get("/getEvent", getEvent)


/**
 * @swagger
 * /event/getEventCreated:
 *   get:
 *     summary: Get events created by a specific brand or creator
 *     description: Fetch events based on the brand name provided as a query parameter.
 *     parameters:
 *       - in: query
 *         name: brand
 *         description: The name of the brand to search for events
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of events created by the specified brand
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   brand_name:
 *                     type: string
 *                   event_name:
 *                     type: string
 *                   event_address:
 *                     type: string
 *                   time_in:
 *                     type: string
 *                     format: date-time
 *                   time_out:
 *                     type: string
 *                     format: date-time
 *                   summary:
 *                     type: string
 *                   picture:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   category:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *       400:
 *         description: No events found for the specified brand
 *       500:
 *         description: Internal server error
 */
 router.get("/getEventCreated", getEventCreated)



export default router;
