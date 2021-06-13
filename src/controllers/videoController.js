import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate(["owner", "comments"]);
    if (!video) {
        return res.render("404", { pageTitle: "Video not found" });
    };
    return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video not found" });
    } else if (String(video.owner) !== String(_id)) {
        req.flash("error", "Not autorized");
        return res.status(403).redirect("/");
    };
    return res.render("edit",  { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const { title, description, hashtags } = req.body;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video not found" });
    } else if (String(video.owner) !== String(_id)) {
        req.flash("error", "Not autorized");
        return res.status(403).redirect("/");
    };
    await Video.findByIdAndUpdate(id, {
        title, 
        description, 
        hashtags: Video.formatHashtags(hashtags)
    });
    return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const { user: { _id } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video not found" });
    } else if (String(video.owner) !== String(_id)) {
        req.flash("error", "Not autorized");
        return res.status(403).redirect("/");
    };
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const { user: { _id } } = req.session;
    const { title, description, hashtags } = req.body;
    const { video, thumbnail } = req.files;
    try {
        const newVideo = await Video.create({
            title, 
            description, 
            fileUrl: `/${video[0].path.split("\\").join("/")}`, 
            thumbnailUrl: `/${thumbnail[0].path.split("\\").join("/")}`, 
            hashtags: Video.formatHashtags(hashtags), 
            owner: _id
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("upload", { 
            pageTitle: "Upload Video", 
            errorMessage: error._message 
        });
    };
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        }).populate("owner");
        return res.render("search", { pageTitle: "Search", videos });
    } else {
        return res.redirect("/");
    };
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    };
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const comment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const { user } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    } else {
        const newComment = await Comment.create({
            text, 
            owner: user._id, 
            video: id
        });
        video.comments.push(newComment._id);
        video.save();
        return res.status(201).json({ newCommentId: newComment._id });
    };
};

export const deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    const { user } = req.session;
    const video = await Video.findById(id);
    const comment = await Comment.findById(commentId);
    if (!video || !comment) {
        return res.sendStatus(404);
    } else {
        if (String(user._id) === String(comment.owner)) {
            await Comment.findByIdAndDelete(commentId);
            video.comments.pull(commentId);
            video.save();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(400);
        };
    };
};