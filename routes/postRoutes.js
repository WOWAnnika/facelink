const express = require('express');
const router = express.Router();
const postController = require("../controllers/postController");
// const {postValidate} = require("../middleware/postValidation");
const {validate} = require("../middleware/validation");
const {authentication} = require("../middleware/authentication");
const upload = require("../middleware/upload");


router.post('/posts/:id/like', postController.likePost);
router.post('/users/posts', authentication,upload.single("image"), validate("post"), postController.createPost);

router.get('/posts/mostLikes', postController.getMostLikedPosts);
router.get('/posts', postController.getAllPosts);

router.delete("/posts/:id", authentication, postController.deletePost);

module.exports = router;