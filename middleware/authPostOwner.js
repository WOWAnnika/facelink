const Post = require("../models/post");

exports.checkPostOwner = async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    //hvis den ikke kan finde en post
    if (!post) return res.status(404).json({message: "Post not found"});

    //hvis user id på post ikke matcher logget ind user
    if (post.user_id.toString() !== userId) {
        return res.status(403).json({message: "Du må altså ikke slette andres posts! >:I"})
    }

    req.post = post;
    next();
};