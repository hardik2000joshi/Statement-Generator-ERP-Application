const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

async function authenticateUser(req, res, next){
    const token = req.cookies.JWT_Token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await userModel.findById(decoded.userId);
    if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
    req.user = user;         
    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized access, token is invalid",
    });
  }
};

function authAdminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Forbidden access, admin account required",
        });
    }
    next();
}


module.exports = {authenticateUser, authAdminMiddleware};                                          
