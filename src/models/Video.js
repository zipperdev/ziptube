import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String, 
        trim: true, 
        maxLength: 80, 
        required: true
    }, 
    description: {
        type: String, 
        trim: true, 
        maxLength: 200, 
        required: true
    }, 
    fileUrl: {
        type: String, 
        required: true
    }, 
    thumbnailUrl: {
        type: String, 
        required: true
    }, 
    createdAt: {
        type: Date, 
        default: Date.now, 
        required: true
    }, 
    hashtags: [
        { 
            type: String, 
            trim: true, 
            required: true
        }
    ], 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            ref: "Comment"
        }
    ], 
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: "User"
    }, 
    meta: {
        views: {
            type: Number, 
            default: 0, 
            required: true
        }, 
        like: {
            type: Number, 
            default: 0, 
            required: true
        }, 
        unlike: {
            type: Number, 
            default: 0, 
            required: true
        }
    }
});

videoSchema.static("formatHashtags", function(hashtags) {
    return hashtags.split(",").map((word) => word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`);
});

const Video = mongoose.model("Video", videoSchema);

export default Video;