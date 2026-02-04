const express = require("express")
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validateSignUpData } = require("../utils/validation");

const cookieParser = require("cookie-parser");
authRouter.use(cookieParser());


authRouter.post("/signup", async(req,res) => {
    try{
        validateSignUpData(req);
        const { firstName,lastName,emailId,password } = req.body;

        const passwordHash = await bcrypt.hash(password,10);
        const user = new User({
            firstName,lastName,emailId,password:passwordHash
        })
        
        const savedUser = await user.save();

        const token = await savedUser.getJWT();

        res.cookie("token",token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 8*60*60*1000
        });

        res.status(201).json({
            message: "User added successfully!",
            data: savedUser,
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  const user = await User.findOne({ emailId });
  if (!user) throw new Error("Invalid Credentials");

  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) throw new Error("Invalid Credentials");

  const token = await user.getJWT();

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax", // localhost friendly
    secure: false
  });

 res.status(200).json({
  message: "Login successful",
  user: {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailId: user.emailId,
  },
  token,
});

});



authRouter.post("/logout", (req,res) => {
    res.cookie("token","", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logout Successful "});
});




module.exports = authRouter