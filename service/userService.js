const User = require('../models/user');
const {hashPassword, comparePassword} = require("../utils/bcrypt")
const {generateToken} = require("../utils/jwt");

// data allerede valideret af middleware
exports.createUser = async (data) => {
    //Hasher password med vores bcrypt util før det bliver gemt i database
    const hashedPassword = await hashPassword(data.password);

    // Opretter vores nye user instans med de validerede data
    const user = new User({
        name: data.name,
        email: data.email,
        password: hashedPassword, //hashed password, plain tekst gemmes aldrig
        posts: [] // Et tomt array til posts
    });

    //Mongoose validere data med schemaet, kan give fejl på duplicate email
    //Resten burde være fint da vi validere i middleware
    await user.save();

    const userObject = user.toObject(); // laver en kopi til vores svar
    delete userObject.password; // Fjerner password fra vores svar
    return userObject; // sender user kopi uden password
};

exports.loginUser = async (email, password) => {
    //Finder vores bruger basseret på email
    const user = await User.findOne({email});

    if (!user) {
        throw new Error("Invalid email or password");
    }

    //Sammenligner indtastet kode med hashed kode
    //Kalder bcrypt util som bruger bcrypt.compare
    //finder salt fra hashed password
    //sammenligner de 2 hashes, hvis ens får vi true
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Genererer JWT token: header.payload.signature
    // Signature beregnes som: hash(header + payload + SECRET_KEY)
    // SECRET_KEY bruges som input til hash-funktionen, men er ikke synlig i token
    // Kun serveren kan verificere/generere gyldig signature (har SECRET_KEY)
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
        options: { sort: { timestamp: -1} } // Sortere efter nyeste post
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

