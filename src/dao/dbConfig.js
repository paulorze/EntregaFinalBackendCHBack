import mongoose from "mongoose";
import { mongoUrl } from "../config/config.js";

try {
    await mongoose.connect(mongoUrl);
    console.log("DB Connected Successfully");
} catch (e) {
    console.log(e);
}