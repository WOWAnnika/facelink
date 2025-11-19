const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const {validate} = require("../middleware/validation");
const {authentication} = require("../middleware/authentication");
const {checkPostOwner} = require("../middleware/authPostOwner")
const upload = require("../middleware/upload");
const { postCreationLimiter, likeLimiter } = require("../middleware/rateLimiter");


router.post('/posts/:id/like',
    likeLimiter,
    postController.likePost);

//tjekker token, upload.single fordi vi kun modtager 1 billede, når billedet valideret så det post og derefter laver vi faktisk post
router.post('/users/posts',
    authentication,
    postCreationLimiter,
    upload.single("image"),
    validate("post"),
    postController.createPost);

router.get('/posts/mostLikes',
    postController.getMostLikedPosts);

router.get('/posts',
    postController.getAllPosts);

router.delete("/posts/:id",
    authentication,
    checkPostOwner,
    postController.deletePost);

module.exports = router;