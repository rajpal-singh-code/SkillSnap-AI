const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async(req,res,next) => {
    try {
        const { token } = req.cookies || {};
        if(!token) return res.status(401).send("Plese Login");

        const decodeobj = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decodeobj;

        const user = await User.findById(_id);
        if(!user) throw new Error("User not found");

        req.user = user;
        req.userId = user._id;
        next();
    } catch(err) {
        res.status(404).send("ERROR : "+ err.message);
    }
};

module.exports = userAuth 