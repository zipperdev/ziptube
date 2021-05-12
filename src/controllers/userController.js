import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getSignup = (req, res) => {
    return res.render("signup", { pageTitle: "Sign Up" });
};

export const postSignup = async (req, res) => {
    const { name, username, email, password, confrimPassword, location } = req.body;
    const pageTitle = "Sign Up";
    const exists = await User.findOne({ email });
    if (exists) {
        if (exists.socialOnly) {
            return res.status(400).render("signup", { 
                pageTitle, 
                errorMessage: `You already login with ${email} email github account. Go to login page and login with github.` 
            });
        } else {
            return res.status(400).render("signup", { 
                pageTitle, 
                errorMessage: "This email was already taken." 
            });
        };
    } else {
        if (password ? password.trim() : password) {
            if (password !== confrimPassword) {
                return res.status(400).render("signup", { 
                    pageTitle, 
                    errorMessage: "Password confrimation doesn't match." 
                });
            } else {
                try {
                    await User.create({
                        name, 
                        username, 
                        email, 
                        password, 
                        location
                    });
                    return res.redirect("/login");
                } catch (error) {
                    return res.status(400).render("signup", { 
                        pageTitle, 
                        errorMessage: error._message 
                    });
                };
            };
        } else {
            return res.status(400).render("signup", { 
                pageTitle, 
                errorMessage: "Password is required."
            });
        };
    };
};

export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).render("login", { pageTitle, errorMessage: "An account with this email does not exists." });
    } else {
        if (user.socialOnly) {
            return res.status(400).render("login", { pageTitle, errorMessage: `You have logged in to your GitHub account with ${user.email} email. Go to login page and login with github.` });
        } else {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(400).render("login", { pageTitle, errorMessage: "Wrong password." });
            } else {
                req.session.loggedIn = true;
                req.session.user = user;
                return res.redirect("/");
            };
        };
    };
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID, 
        allow_signup: false, 
        scope: "read:user user:email"
    };
    const params = new URLSearchParams(config).toString();
    return res.redirect(`${baseUrl}?${params}`);
};

export const callbackGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID, 
        client_secret: process.env.GITHUB_CLIENT_SECRET, 
        code: req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const tokenRequest = await (
        await fetch(`${baseUrl}?${params}`, {
            method: "POST", 
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const userEmails = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailObj = userEmails.find(
            (email) => email.primary === true && email.verified === true
        );
        if (!emailObj) {
            return res.redirect("/login");
        };
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                avatarUrl: userData.avatar_url, 
                name: userData.name ? userData.name : 'Undefined', 
                username: userData.login, 
                email: emailObj.email, 
                password: "", 
                socialOnly: true, 
                location: userData.location ? userData.location : 'Undefined'
            });
        };
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    };
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    if (!user) {
        return res.status(404).render("404", {
            pageTitle: "User not found."
        });
    }
    return res.render("profile", {
        pageTitle: user.username,
        user
    });
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
    const { user: { _id, avatarUrl } } = req.session;
    const { name, username, email, location } = req.body;
    if (username && email) {
        const emailUser = await User.findOne({ email });
        if (emailUser && emailUser._id != _id) {
            return res.render("edit-profile", { pageTitle: "Edit Profile", errorMessage: "This email was already taken." });
        } else {
            try {
                const updatedUser = await User.findByIdAndUpdate(_id, {
                    avatarUrl: req.file ? `/${req.file.path.split("\\").join("/")}` : avatarUrl, 
                    name: name ? name : "Undefined", 
                    email, 
                    username, 
                    location: location ? location : "Undefined"
                }, { new: true });
                req.session.user = updatedUser;
                return res.redirect("/users/edit");
            } catch (error) {
                return res.render("edit-profile", { pageTitle: "Edit Profile", errorMessage: error.message });
            };
        };
    } else {
        return res.render("edit-profile", { pageTitle: "Edit Profile", errorMessage: "Username and email is required." });
    };
};

export const getChangePassword = (req, res) => {
    return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
    const { user: { _id, password } } = req.session;
    const { cPassword, nPassword, nConfrimPassword } = req.body;
    if (cPassword && nPassword && nConfrimPassword) {
        const passwordMatch = await bcrypt.compare(cPassword, password);
        if (!passwordMatch) {
            return res.status(400).render("change-password", { pageTitle: "Change Passoword", errorMessage: "Current Password doesn't match." });
        } else {
            if (nPassword !== nConfrimPassword) {
                return res.status(400).render("change-password", { pageTitle: "Change Passoword", errorMessage: "Password confrimation doesn't match." });
            } else {
                try {
                    const user = await User.findById(_id);
                    user.password = nPassword;
                    await user.save();
                    req.session.user.password = user.password;
                    req.session.destroy();
                    return res.redirect("/login");
                } catch (error) {
                    return res.status(400).render("change-password", { pageTitle: "Change Passoword", errorMessage: error.message });
                };
            };
        };
    } else {
        return res.status(400).render("change-password", { pageTitle: "Change Passoword", errorMessage: "All input is required." });
    };
};

export const remove = (req, res) => res.send("Remove");