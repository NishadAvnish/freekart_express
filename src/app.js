import cors from "cors"
import express from "express"


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// for getting json in api body
app.use(express.json({ limit: "16kb", }))
//extended for object inside object
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

//routes

import userRouter from "./routes/user.routes.js"

//route decleration
app.use("api/v1/users", userRouter);


export { app }