import express from "express";
import { see, upload, edit, remove } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", remove);
videoRouter.get("/upload", upload);

export default videoRouter;