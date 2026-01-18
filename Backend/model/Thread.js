import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user" , "assistant"],
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ThreadSchema = mongoose.Schema({
    userId: {
        type:String,
        required:true
    },
    threadId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Thread" , ThreadSchema) 