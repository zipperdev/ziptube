import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        unique: true, 
        required: true
    }, 
    avatarUrl: {
        type: String
    }, 
    socialOnly: {
        type: Boolean, 
        default: false
    }, 
    username: {
        type: String, 
        required: true
    }, 
    name: {
        type: String, 
        required: true
    }, 
    password: {
        type: String
    }, 
    location: String
});

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;