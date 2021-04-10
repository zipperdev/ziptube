import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String, 
    description: String, 
    createdAt: Date, 
    hashtags: [
        { type: String }
    ], 
    meta: {
        views: Number, 
        like: Number, 
        unlike: Number
    }
});

const Video = mongoose.model("Video", videoSchema);
export default Video;