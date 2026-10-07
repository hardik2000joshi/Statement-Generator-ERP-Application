const mongoose = require("mongoose");
const templateModel = require("../models/templates");
const bankStatementModel = require("../models/bankStatement");
const transporter = require("../services/EmailService");
const generateBankStatementPdf = require("../utils/generateBankStatementPdf");
const sendStatementEmail = async(req, res) => {
    try {
        const {templateId, bankStatementId, recepientEmail, cc, bcc} = req.body;
        // validate required fields
        if(!templateId){
            return res.status(400).json({
                success: false,
                message: "templateId is required",
            });
        }
        if(!bankStatementId){
            return res.status(400).json({
                success: false,
                message: "bankStatementId is required",
            });
        }
        if(!recepientEmail){
            return res.status(400).json({
                success: false,
                message: "recepientEmail is required",
            });
        }

        // validate object Id's
        if(!mongoose.Types.ObjectId.isValid(templateId)){
            return res.status(400).json({
                success: false,
                message: "Invalid templateId",
            });
        }

        if(!mongoose.Types.ObjectId.isValid(bankStatementId)){
            return res.status(400).json({
                success: false,
                message: "Invalid Bank Statement Id",
            });
        }

        // find template
        const template = await templateModel.findById(templateId);
        if(!template){
            return res.status(404).json({
                success: false,
                message: "Template Email not found",
            });  
        }

        // find bank statement
        const bankStatement = await bankStatementModel.findById(bankStatementId)
        .populate("company")
        .populate({
            path: "transactions",
            populate: [{
                path: "vendor",
                select: "name description",
            }, {
                path: "category",
                select: "name description",
            }],
        });

        if (!bankStatement) {
            return res.status(404).json({
                success: false,
                message: "Bank statement not found",
            });
        }

        // prepare dynamic values
        const company = bankStatement.company;
        const totalTransactions = bankStatement.totalTransactions || bankStatement.transactions?.length || 0;
        const periodStart = bankStatement.periodStart? new Date(bankStatement.periodStart).toLocaleDateString("en-IN"): "";
        const periodEnd = bankStatement.periodEnd ? new Date(bankStatement.periodEnd).toLocaleDateString("en-IN"): "";
        const openingBalance = Number(bankStatement.openingBalance || 0).toLocaleString("en-IN");
        const closingBalance = Number(bankStatement.closingBalance || 0).toLocaleString("en-IN");
        const totalAmount = bankStatement.transactions?.reduce((total, transaction) => {
            return total + Number(transaction.amount || 0);
        }, 0);

        // dynamic template values
         const variables = {
            companyName: company?.companyName || "",
            email: company?.email || "",
            phone: company?.phone || "",
            address: company?.address || "",

            periodStart,
            periodEnd,

            totalTransactions,

            openingBalance,
            closingBalance,

            totalAmount: Number(totalAmount || 0).toLocaleString("en-IN"),

            statementType: bankStatement.statementType || "",

            senderName: "Statement Generator",
        };

        // replace {{variables}}
        const replaceVariables = (text) => {
            if (!text) {
                return "";
            }

            return text.replace(
                /{{\s*([^}]+)\s*}}/g,
                (match, variableName) => {
                    const key = variableName.trim();
                    return variables[key] !== undefined
                        ? String(variables[key])
                        : match;
                }
            );
        };

        const subject = replaceVariables(template.subject);
        const html = replaceVariables(template.body);

        // generate pdf
                const pdfBuffer = await generateBankStatementPdf(bankStatement);
        
                // upload PDF to imagekit
                const fileName = `bank-statement-${bankStatement._id}.pdf`;
        // send mail
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recepientEmail,
            cc,
            bcc,
            subject,
            html,
            attachments: [{
                fileName: fileName,
                content: pdfBuffer,
                contentType: "application/pdf",
            }],   
        };

        const info = await transporter.sendMail(mailOptions);

        // response
        return res.status(200).json({
            success: true,
            message: "Bank Statement email sent successfully",
            messageId: info.messageId,
            recepientEmail,
            cc,
            template: {
                id: template._id,
                name: template.name,
                type: template.type,
                subject: template.subject,
                body: template.body
            },
        });
            }
    catch(error){
        console.error("Send statement email error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send bank statement email",
            error: error.message,
        });
        }
}
module.exports = {sendStatementEmail};