 require("dotenv").config()
 const app = require("./app");
 const connectDB = require("./config/db");
 connectDB()
 const PORT = process.env.PORT || 3006; 
 app.listen(PORT, () => {
    console.log("Backend server runs on port", PORT);
 })
