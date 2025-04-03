import app from ".";
import mongoose from 'mongoose';
import * as dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.db_url || "").then(() => {
    console.log("connected to db successfully");
});

app.listen("3000");
