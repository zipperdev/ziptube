import express from "express";
import { see, getEdit, remove, startGithubLogin, callbackGithubLogin, postEdit } from "../controllers/userController";
import { forLoggedIn, forLoggedOut } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/edit").all(forLoggedIn).get(getEdit).post(postEdit);
userRouter.get("/remove", forLoggedIn, remove);
userRouter.get("/github/login", forLoggedOut, startGithubLogin);
userRouter.get("/github/callback", forLoggedOut, callbackGithubLogin);
userRouter.get("/:id", see);

export default userRouter;