export const trending = (req, res) => {
    const videos = [
        {
            title:"First Video", 
            rating: 5, 
            comments: 2, 
            createdAt: "2 minutes ago", 
            views: 1000, 
            id: 1 
        }, 
        {
            title:"Second Video", 
            rating: 5, 
            comments: 5, 
            createdAt: "4 minutes ago", 
            views: 10000, 
            id: 2 
        }, 
        {
            title:"Third Video", 
            rating: 5, 
            comments: 10, 
            createdAt: "10 minutes ago", 
            views: 100000, 
            id: 3 
        }
    ];
    return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const remove = (req, res) => res.send("Delete");