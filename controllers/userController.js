const userService = require ("../service/userService");

//POST
exports.createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//GET
exports.getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

//GET
exports.getPostsByUserId = async (req, res) => {
    try {
        const posts = await userService.getPostsByUser(req.params.id);
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

//GET
exports.getUsersWithMostPosts = async (req, res) => {
    try {
        const users = await userService.getUsersWithMostPosts();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};