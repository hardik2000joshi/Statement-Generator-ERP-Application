const mongoose = require("mongoose");
const industrySchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});

const industryModel = mongoose.model("Industry", industrySchema);
module.exports = industryModel;