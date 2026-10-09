const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");

const createToken = (user) => {
    return jwt.sign({
         // .sign - for verifying the token
         userId: user._id,
         role: user._role,
}, process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    })
}