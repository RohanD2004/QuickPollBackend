
const jwt= require("jsonwebtoken")
const dotenv=require("dotenv").config();

const verifyToken = (req, res, next) => {
    let authorization = req.headers.authorization; 

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token is not present" });
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SCREET);
        req.user = decoded;
        next(); // Call next() to proceed without sending a response
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token"+error });
    }
};

module.exports = verifyToken;
