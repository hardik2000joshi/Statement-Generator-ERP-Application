const mongoose = require("mongoose");
const companyModel = require("../models/companyModel");
const vendorModel = require("../models/vendorModel");
const generateTransactions =  require("../utils/generateTransactions");
const transactionModel = require("../models/transaction");
const bankStatementModel = require("../models/bankStatement");
const calculateBalances = require("../utils/calculateBalances");
async function generateBankStatement(req, res){
    try {
        const {companyId, fromDate, toDate, rules} = req.body;
        if(!companyId){
            return res.status(400).json({
                success: false,
                message: "company is required",
                        });
        }
        if(!fromDate || !toDate){
            return res.status(400).json({
                success: false,
                message: "fromDate and toDate are required", 
            });
    }
    if(!rules){
        return res.status(400).json({
            success: false,
            message: "Generation rules are required",
        });
    }

    if(!mongoose.Types.ObjectId.isValid(companyId)){
        return res.status(400).json({
            success: false,
            message: "Invalid Company ID",
        });
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    if(Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())){
        return res.status(400).json({
            success: false,
            message: "Invalid date format",
        });
    } 

    if(startDate >= endDate){
        return res.status(400).json({
            success: false,
            message: "fromDate must be before toDate",
        });
       }

       if(!Number.isInteger(rules.txnsPerWeek) || rules.txnsPerWeek <= 0) {
        return res.status(400).json({
            success: false,
            message: "txnsPerWeek must be graeter than zero",
        });
       }

       const company = await companyModel.findById(companyId);
       if(!company){
        return res.status(404).json({
            success: false,
            message: "Company not found",
        });
       }
       
       const vendors = await vendorModel.find();
       if(!vendors.length){
        return res.satus(400).json({
            success: false,
            message: "No vendors found",
        });
       }

       const generatedTransactions = generateTransactions({
        companyId: company._id,
    vendors,
    fromDate,
    toDate,
    txnsPerWeek: rules.txnsPerWeek,
       });

       if(!generatedTransactions.length){
         return res.status(400).json({
        success: false,
        message: "No valid transactions could be generated",
      });
       }

       const openingBalance = 5000;

       const {transactions, closingBalance} = calculateBalances(generatedTransactions, openingBalance);
       const savedTransactions = await transactionModel.insertMany(
        transactions
       );

       const statement = await bankStatementModel.create({
        company: company._id,
        accountNumber: company.bankDetails?.accountNumber || "",
        statementType: rules.style || "basic",
        periodStart: startDate,     
        periodEnd: endDate,
        openingBalance,
        closingBalance,
        totalTransactions: savedTransactions.length,
        transactions: savedTransactions.map((transaction) => transaction._id),
       });

       return res.status(201).json({
        success: true,
        message: "Bank statement generated successfully",
        data: {
        statementId: statement._id,
        company: company._id,
        totalTransactions: savedTransactions.length,
        openingBalance,
        closingBalance,
        transactions: savedTransactions
      },
       });
}
    catch(error){
        console.error("Generate Bank Statement Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate bank statement",
      error: error.message,
    });
    }
}

const getBankStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const statement = await bankStatementModel
      .findById(id)
      .populate("company")
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

    if (!statement) {
      return res.status(404).json({
        success: false,
        message: "Bank statement not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bank statement fetched successfully",
      data: statement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {generateBankStatement, getBankStatement}