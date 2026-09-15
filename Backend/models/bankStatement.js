import mongoose from "mongoose";

export const bankStatementSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    statementType: {
      type: String,
      enum: ["basic", "detailed", "minimal"],
      required: true,
    },

    periodStart: {
      type: Date,
      required: true,
    },

    periodEnd: {
      type: Date,
      required: true,
    },

    openingBalance: {
      type: Number,
      required: true,
    },

    closingBalance: {
      type: Number,
      required: true,
    },

    totalTransactions: {
      type: Number,
      required: true,
    },

    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const bankStatementModel = mongoose.model(
  "BankStatement",
  bankStatementSchema
);

module.exports = bankStatementModel

