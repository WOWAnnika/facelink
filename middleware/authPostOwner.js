const Post = require("../models/post");

exports.checkPostOwner = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    //hvis den ikke kan finde en post
    if (!post) return res.status(404).json({message: "Post not found"});

    if (post.user_id.toString() !== userId) {
        return res.status(403).json({message: "Du må altså ikke slette andres posts! >:I"})
    }
    //gemmer til brug i service, så vi ikke også behøver lava et nyt DB kald der
    req.post = post;
    next();
};