export const trending = (req, res) => res.send("Home");
export const search = (req, res) => res.send("Search");
export const see = (req, res) => res.send(`Watch Video #${req.params.id}`);
export const upload = (req, res) => res.send("Upload");
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Delete");