import mongoose, { Schema } from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        lowercase: true,
        unique: true,
    },
    email:{
        type: String,
        required: [true, "email is required"],
        lowercase: true,
        unique: true,
    },
    password:{
        type: String,
        required: [true, "password is required"]
    }
}, {timestamps:true})

export const User = mongoose.model("User", userSchema)