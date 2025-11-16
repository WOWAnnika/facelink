const User = require('../models/user');
const {hashPassword, comparePassword} = require("../utils/bcrypt")
const {generateToken} = require("../utils/jwt");


exports.createUser = async (data) => {
    const hashedPassword = await hashPassword(data.password);

    const user = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        posts: []
    });

    await user.save(); // gemmer til DB

    const userObject = user.toObject(); // laver en kopi til vores svar
    delete userObject.password; // Fjerner password fra vores svar
    return userObject; // sender user kopi uden password
};

// exports.createUser = async (data) => {
//     const user = new User(data);
//     await user.save();
//     return user;
// };

exports.loginUser = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);

    const userObject = user.toObject()
    delete userObject.password;
    return {
        user: userObject,
        token: token
    };
};

exports.getUserById = async (userId) => {
    const user =  await User.findById(userId)
        .populate('posts');

    return user;
};

exports.getPostsByUser = async (userId) => {
    const user = await User.findById(userId).populate({
        path: "posts",
        options: { sort: { timestamp: -1} }
    });
    return user.posts;
};

exports.getUsersWithMostPosts = async () => {
    const result = await User.aggregate ([
        //laver et nyt felt, til total antal posts
        {
          $addFields: {
              //giver totalPosts værdien af længen af arrayet posts i User
              totalPosts: { $size: "$posts" }
          }
        },
        { $sort: { totalPosts: -1} },
        {
            $project: {
                name: "$name",
                totalPosts: 1
            }
        }
    ]);
    return result;
}

