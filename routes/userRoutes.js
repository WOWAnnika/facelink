const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const {validate} = require("../middleware/validation");
const { authLimiter } = require("../middleware/rateLimiter");

router.get("/users/:id/posts", userController.getPostsByUserId);
//Skal stå over /users/:id
router.get("/users/mostPosts", userController.getUsersWithMostPosts);
router.get("/users/:id", userController.getUserById);


router.post("/users", authLimiter, validate("user"), userController.createUser);
router.post("/login", authLimiter, validate("login"), userController.loginUser);



module.exports = router;