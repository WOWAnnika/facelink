const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;
const TIME = process.env.TIME;


exports.generateToken = (userId) => {
    const token = jwt.sign(
        {userId: userId},
        SECRET_KEY,
        { expiresIn: TIME }
    );
    return token;
};

exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired token")
    }
};