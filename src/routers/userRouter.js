import express from "express";
import { see, getEdit, remove, startGithubLogin, callbackGithubLogin, postEdit, getChangePassword, postChangePassword } from "../controllers/userController";
import { avatarUpload, forLoggedIn, forLoggedOut, forNotSocialUser } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/edit").all(forLoggedIn).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/edit/password").all(forLoggedIn, forNotSocialUser).get(getChangePassword).post(postChangePassword);
userRouter.get("/remove", forLoggedIn, remove);
userRouter.get("/github/login", forLoggedOut, startGithubLogin);
userRouter.get("/github/callback", forLoggedOut, callbackGithubLogin);
userRouter.get("/:id", see);

export default userRouter;