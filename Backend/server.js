 require("dotenv").config()
 const app = require("./app");
 const connectDB = require("./config/db");
 connectDB()
 app.listen(3006, () => {
    console.log("Backend server runs on port 3006");
 })