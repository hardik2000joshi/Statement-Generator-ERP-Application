const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

async function authenticateUser(req, res, next){
    const token = req.cookies?.JWT_Token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "unauthorized access token is missing",
      });
    }
     console.log("authenticateUser called");
console.log("Cookies:", req.cookies);
console.log("JWT token exists:", !!req.cookies?.JWT_Token);

    try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await userModel.findById(decoded.userId);
     if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        console.log(res);
    req.user = user;         
    return next();
  } catch (error) {
    console.error("Authentication Error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized access, token is invalid",
    });
  }
};

async function authorizeRoles(req, res, next) {
    const token = req.cookies?.JWT_Token
    console.log("authenticateUser called"); 
console.log("Cookies:", req.cookies);
console.log("JWT token exists:", !!req.cookies?.JWT_Token);
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access token is missing",
            });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.userId);
            if(user.role !== "ADMIN"){
                return res.status(403).json({
                    message: "Forbidden access not an admin account"
                })
            }
            req.user = user;
            return next()
        }
        catch(error){
            return res.status(401).json({
                success: false,
    message: "unauthorized access, token is invalid"
})
        }
}


module.exports = {authenticateUser, authorizeRoles};                                          
