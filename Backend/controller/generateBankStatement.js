const generateBankStatementPdf = require("../utils/generateBankStatementPdf");
const imageKit = require("../config/imageKit");
const bankStatementModel = require("../models/bankStatement");

const downloadBankStatement = async(req, res) => {
    try {
        const {id} = req.params;
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
        if(!statement){
            return res.status(404).json({
                success: false,
                message: "Bank Statement not found",
            });
        }

        // generate pdf
        const pdfBuffer = await generateBankStatementPdf(
            statement
        );

        // upload PDF to imagekit
        const fileName = `bank-statement-${statement._id}.pdf`;
        const pdfBase64 = pdfBuffer.toString("base64");
        const uploadResponse = await imageKit.files.upload({
            file: pdfBase64,
            fileName,
            folder: "/bank-statements",
            useUniqueFileName: false,
        });
        console.log("Bank Statement Uploaded to ImageKit: ", uploadResponse.url);

        // send pdf to browser
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        return res.status(200).send(pdfBuffer);
    }
    catch(error){
        console.error("Download Bank Statement Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate PDF",
            error: error.message,
        });
    }
};

module.exports = {downloadBankStatement}