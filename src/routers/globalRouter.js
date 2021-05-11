import express from "express";
import { home, search } from "../controllers/videoController";
import { getSignup, postSignup, getLogin, postLogin, logout } from "../controllers/userController";
import { forLoggedIn, forLoggedOut } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/signup").all(forLoggedOut).get(getSignup).post(postSignup);
globalRouter.route("/login").all(forLoggedOut).get(getLogin).post(postLogin);
globalRouter.get("/logout", forLoggedIn, logout);
globalRouter.get("/search", search);

export default globalRouter;