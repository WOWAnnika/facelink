const postService = require ("../service/postService");

//POST
exports.createPost = async (req, res) => {
    try {
        const text = req.body.text;

        //hvis req.file eksistere bliver image sat til /img/osv. hvis ikke bliver den sat til null
        //sætter til null i stedet for undefined så stadig lavet felt i DB
        const image = req.file ? `/img/${req.file.filename}` : null;

        const post = await postService.createPost(req.user.id, {text, image});
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.likePost = async (req, res) => {
    try {
        const result = await postService.likePost(req.params.id, req.user.id);
        if (!result) {
            return res.status(404).json({error: 'post not found'});
        }
        res.status(200).json({
            liked: result.liked,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// exports.unlikePost = async (req, res) => {
//     try{
//         const post = await postService.unlikePost(req.params.id, req.user.id);
//         if (!post) {
//             return res.status(404).json({error: 'post not found'});
//         }
//         res.status(200).json(post);
//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// };


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
        const post = await postService.deletePost(req.post);
        //ikke helt sikkert denne er nødvendig længere nu hvor authPostOwner også tjekker dette
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
};