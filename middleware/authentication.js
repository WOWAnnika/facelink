const jwt = require("jsonwebtoken");

//token authentication, bruges f.eks. til finde ud af hvem en bruger er
exports.authentication = (req, res, next) => {
    //henter Authorization-headeren
    const authHeader = req.headers.authorization;

    //sådan en ser sådan her ud
    //Authorization: Bearer <TOKEN>
    //Så tjekker om headeren ikke findes eller ikke starter med Bearer og hvis ikke så ikke tillade adgang
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "unauthorized"});
    }
    //her fjerner vi bearer delen og tager kun token
    const token = authHeader.split(" ")[1];


    try {
        //her tjekker vi om den token faktisk matcher vores secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        //Så hvis logget ind bruger har gyldig token giver vi adgang til det tilhørende userId
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        res.status(401).json({message: "unauthorized"});
    }
}

