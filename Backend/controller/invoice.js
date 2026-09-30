const mongoose = require("mongoose");
const bankStatementModel = require("../models/bankStatement");
const transactionModel = require("../models/transaction");
const invoiceModel = require("../models/InvoiceModel");
const createInvoice = async (req, res) => {
    try {
const {bankStatementId, transactionId} = req.body;
// validating bank statement id
if(!bankStatementId){
    return res.status(400).json({
        success: false,
        message: "bankStatementId is required",
    });
}

if(!mongoose.Types.ObjectId.isValid(bankStatementId)){
    return res.status(400).json({
        success: false,
        message: "Invalid bank statement ID",
    });
}

// find bank statement
const bankStatement = await bankStatementModel.findById(bankStatementId).populate("company");
if(!bankStatement){
    return res.status(404).json({
        success: false,
        message: "Bank Statement not found",
    });
}

// IDs of all transactions belonging to this bank statement
    const statementTransactionIds = bankStatement.transactions.map((id) =>
      id.toString()
    );
    let selectedTransactionIds;
    // If transactionIds are not provided, use all statement transactions
    if (!transactionId || transactionId.length === 0) {
      selectedTransactionIds = statementTransactionIds;
    } else {
      // Validate transactionIds format
      if (!Array.isArray(transactionId)) {
        return res.status(400).json({
          success: false,
          message: "transactionIds must be an array",
        });
      }

      // Validate every transaction ID
      const invalidTransactionId = transactionId.find(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidTransactionId) {
        return res.status(400).json({
          success: false,
          message: `Invalid transaction ID: ${invalidTransactionId}`,
        });
      }

      // Ensure selected transactions belong to this bank statement
      const transactionDoesNotBelongToStatement = transactionId.some(
        (id) => !statementTransactionIds.includes(id.toString())
      );
      if (transactionDoesNotBelongToStatement) {
        return res.status(400).json({
          success: false,
          message:
            "One or more selected transactions do not belong to this bank statement",
        });
      }
      selectedTransactionIds = transactionId;
    }

    if (selectedTransactionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No transactions available for invoice generation",
      });
    }


     // Fetch selected transactions
    const selectedTransactions = await transactionModel
      .find({
        _id: { $in: selectedTransactionIds },
      })
      .populate("vendor", "name")
      .populate("category", "name");

    // Ensure all selected transactions exist
    if (selectedTransactions.length !== selectedTransactionIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more transactions were not found",
      });
    }

    // Calculate invoice total from transaction amounts
    const totalAmount = selectedTransactions.reduce((total, transaction) => {
      return total + Number(transaction.amount || 0);
    }, 0);

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Create invoice database record
    const invoice = await invoiceModel.create({
      invoiceNumber,
      company: bankStatement.company._id,
      bankStatement: bankStatement._id,
      transactions: selectedTransactions.map(
        (transaction) => transaction._id
      ),
      periodStart: bankStatement.periodStart,
      periodEnd: bankStatement.periodEnd,
      totalAmount,
      totalTransactions: selectedTransactions.length,
      status: "GENERATED",
    });


    // Return created invoice with details
    const createdInvoice = await invoiceModel
      .findById(invoice._id)
      .populate("company")
      .populate("bankStatement")
      .populate({
        path: "transactions",
        populate: [
          {
            path: "vendor",
            select: "name",
          },
          {
            path: "category",
            select: "name",
          },
        ],
      });

      return res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      invoice: createdInvoice,
    });

    }
    catch(error){
        console.error("Create invoice error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: error.message,
    });
    }
}

const fetchAllInvoices = async(req, res) => {
  try {
    const invoices = await invoiceModel.find()
    .populate("company")
    .populate("bankStatement")
    .populate({
      path: "transactions",
      populate: [
        {
          path: "vendor",
          select: "name",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    })
    .sort({createdAt: -1});
    return res.status(200).json({
      success: true,
      message: "Invoices fetched Successfully",
      count: invoices.length,
      invoices,
    });
  }
  catch(error){
    console.error("Fetch all invoices error: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

const fetchInvoicesById = async(req, res) => {
  try {
    const {id} = req.params;
    // validate invoice ID
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID",
      });
    }
    const invoice = await invoiceModel.findById(id)
    .populate("company")
    .populate("bankStatement")
    .populate({
      path: "transactions",
      populate: [
        {
          path: "vendor",
          select: "name",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    });

    if(!invoice){
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Invoice fetched successfully",
      invoice,
    });
  }
  catch(error){
    console.error("Fetch Invoice Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

module.exports = {createInvoice, fetchAllInvoices, fetchInvoicesById}