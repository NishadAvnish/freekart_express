import connectDB from "./src/db/index.js";
import cors from "cors"
import express from "express"
import dotenv from "dotenv";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

dotenv.config({
    path: '.env'
})

// for getting json in api body
app.use(express.json({ limit: "16kb", }))
//extended for object inside object
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is Running at Port", process.env.PORT);
    });
}).catch(() => { })

