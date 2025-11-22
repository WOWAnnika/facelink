const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const {validate} = require("../middleware/validation");
const {authentication} = require("../middleware/authentication");
const {checkPostOwner} = require("../middleware/authPostOwner")
const upload = require("../middleware/upload");
const { postCreationLimiter, likeLimiter } = require("../middleware/rateLimiter");

//POST til at toggle likes
router.post('/posts/:id/like',
    authentication,
    likeLimiter,
    postController.likePost);


//POST til at oprette en post
router.post('/users/posts',
    //tjekker token, upload.single fordi vi kun modtager 1 billede, når billedet valideret så det post og derefter laver vi faktisk post
    authentication,
    postCreationLimiter,
    upload.single("image"),
    validate("post"),
    postController.createPost);

//GET til at få mest liked posts
router.get('/posts/mostLikes',
    postController.getMostLikedPosts);

//GET til at få alle posts
router.get('/posts',
    postController.getAllPosts);

//DELETE til at slette en post
router.delete("/posts/:id",
    authentication,
    checkPostOwner,
    postController.deletePost);

module.exports = router;