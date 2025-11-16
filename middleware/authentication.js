const jwt = require("jsonwebtoken");

exports.authentication = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "unauthorized"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({message: "unauthorized"});
    }
}

