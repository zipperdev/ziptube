import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    res.locals.appName = "Ziptube";
    next();
};

export const forLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Not autorized");
        return res.redirect("/login");
    };
};

export const forLoggedOut = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Not autorized");
        return res.redirect("/");
    };
};

export const forNotSocialUser = (req, res, next) => {
    if (!req.session.socialOnly) {
        return next();
    } else {
        return res.redirect("/");
    };
};

export const avatarUpload = multer({ dest: "uploads/avatars/", limits: {
    fileSize: 10000000
} });
export const videoUpload = multer({ dest: "uploads/videos/", limits: {
    fileSize: 2800000000
} });