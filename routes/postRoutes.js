const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
const {postValidate} = require("../middleware/postValidation");


router.post('/posts/:id/like', postController.likePost);
router.post('/users/:id/posts',postValidate, postController.createPost);

router.get('/posts/mostLikes', postController.getMostLikedPosts);

router.delete("/posts/:id", postController.deletePost);

module.exports = router;