const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const {userValidation} = require ("../middleware/userValidation");

router.get("/users/:id/posts", userController.getPostsByUserId);
//Skal stå over /users/:id
router.get("/users/mostPosts", userController.getUsersWithMostPosts);
router.get("/users/:id", userController.getUserById);


router.post("/users", userValidation, userController.createUser);



module.exports = router;