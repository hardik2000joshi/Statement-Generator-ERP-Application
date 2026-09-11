const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    categoryType: {
        type: String,
        enum: ["Income", "Expense"],
        required: true,
    },
    colorTheme: {
        type: String,
        enum: [
            "BLUE",
            "YELLOW",
            "RED",
            "GREY",
            "GREEN",
            "PURPLE",
            "ORANGE",
            "INDIGO",
        ],
        required: true,
    },
}, {
    timestamps: true,
});
const categoryModel = mongoose.model("VendorCategory", categorySchema);
module.exports = categoryModel;