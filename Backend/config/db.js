const mongoose = require("mongoose");
function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("connected to database");
    })
    .catch(error => {
        console.error("Error connecting to database");
        process.exit(1)
    })
}
module.exports = connectDB