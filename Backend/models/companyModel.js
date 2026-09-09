const mongoose = require("mongoose");
const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    gstNumber: {
        type: String,
        trim: true,
    },
    panNumber: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: "India",
    },
    industryType: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
    }],
    logo: {
        type: String,
    },
    bankDetails: {
        bankName: String,
        accountNumber: String,
        ifscCode: String,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE",
    },
}, {
    timestamps: true,
});
const companyModel = mongoose.model("Company", companySchema);
module.exports = companyModel;