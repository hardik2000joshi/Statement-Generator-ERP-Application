import mongoose from "mongoose";
export const transactionSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
       ref: "VendorCategory",
      required: true,
    },
    date: {
        type: Date,
      required: true,
    },
    description: {
        type: String,
      required: true,
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
       required: true,
    },
    amount: {
        type: Number,
         required: true,
        min: 0,
    },
    balance: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
});

const transactionModel = mongoose.model("Transaction", tansactionSchema);
module.exports = transactionModel;