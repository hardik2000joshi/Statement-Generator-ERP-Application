 require("dotenv").config()
 const app = require("./app");
 const connectDB = require("./config/db");
 connectDB()
 const PORT = process.env.PORT || 3006; 
 app.listen(3006, () => {
    console.log("Backend server runs on port", PORT);
 })