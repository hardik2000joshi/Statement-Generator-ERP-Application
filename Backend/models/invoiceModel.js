const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    bankStatement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BankStatement",
        required: true,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            required: true,
        }
    ],
    periodStart: {
        type: Date,
        required: true,
    },
    periodEnd: {
        type: Date,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
        default: 0,    
    },
    totalTransactions: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: ["DRAFT", "GENERATED", "PAID", "CANCELLED"],
        default: "GENERATED",
    },
}, {
    timestamps: true,
});

const invoiceModel = mongoose.model("Invoice", invoiceSchema);
module.exports = invoiceModel;