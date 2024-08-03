import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {

    try {
        const connectionResponse = await mongoose.connect(`${process.env.DATABASE_URL}/${DB_NAME}`)
        // console.log(`ConnectionInstance `, connectionResponse);
    } catch (error) {
        console.log("MongoDb Connection Failed", error);
        process.exit(1);
    }
};





export default connectDB 