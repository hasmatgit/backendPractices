import mongoose, { Schema } from "mongoose";
import { type } from "os";
import { boolean } from "webidl-conversions";

const subTodoSchema = new mongoose.Schema ({
    content:{
        type: String,
        required: true
    },
    complete:{
        type: Boolean,
        completed: false
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const SubTodo = mongoose.model("SubTodo", subTodoSchema)