const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [4, "First name must be at least 4 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    emailId: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("Invalid email address : "+ value)
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value))
                throw new Error("Plese enter the strong password : "+ value)
        }
    }
}, {
    timestamps: true,
})

UserSchema.methods.validatePassword = async function (passwordInputByUser) {
    return await bcrypt.compare(passwordInputByUser,this.password)
}

UserSchema.methods.getJWT = async function () {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET,{expiresIn: "7d"});
}

module.exports = mongoose.model("User", UserSchema);