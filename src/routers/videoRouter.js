import express from "express";
import { watch, getEdit, postEdit, deleteVideo, getUpload, postUpload } from "../controllers/videoController";
import { forLoggedIn, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(forLoggedIn).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(forLoggedIn).get(deleteVideo);
videoRouter.route("/upload").all(forLoggedIn).get(getUpload).post(videoUpload.fields([
    { name: "video", maxCount: 1 }, 
    { name: "thumbnail", maxCount: 1 }
]), postUpload);

export default videoRouter;