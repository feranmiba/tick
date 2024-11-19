import express from "express"
// import bodyparserJsonError from "bodyparser-json-error"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import authRoute from "./src/routes/auth-routes.js"
import profileRoute from "./src/routes/profile-route.js"
import eventRoute from "./src/routes/event-route.js"


dotenv.config()

const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: true}))


app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '10mb' }));  // Increase the limit as needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));





app.get("/",( req, res ) => {
    res.send("Hello world")
})

app.use("/auth", authRoute)
app.use("/profile", profileRoute)
app.use("/event", eventRoute)

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
