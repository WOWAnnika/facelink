const postService = require ("../service/postService");

//POST
exports.createPost = async (req, res) => {
    console.log("req body: ",req.body);
    try {
        const post = await postService.createPost(req.params.id, req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await postService.likePost(req.params.id);
        if (!post) {
            return res.status(404).json({error: 'post not found'});
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//GET
exports.getMostLikedPosts = async (req, res) => {
    try {
        const post = await postService.getMostLikedPosts();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await postService.deletePost(req.params.id);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}