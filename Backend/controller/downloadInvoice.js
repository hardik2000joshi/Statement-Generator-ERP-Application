const mongoose = require("mongoose");
const invoiceModel = require("../models/invoiceModel");
const imagekit = require("../config/imageKit");
const {
    generateInvoicePDF,
} = require("../utils/generateInvoicePdf");

const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invoice ID is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid invoice ID",
            });
        }

        /*
         * Fetch invoice
         */
        const invoice = await invoiceModel
            .findById(id)
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

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        /*
         * Generate PDF
         */
        const pdfBuffer = await generateInvoicePDF(invoice);

        /*
         * Upload PDF to ImageKit
         */
        const pdfBase64 = pdfBuffer.toString("base64");
        const uploadResponse = await imagekit.files.upload({
            file: pdfBase64,
            fileName: `${invoice.invoiceNumber}.pdf`,
            folder: "/invoices",
            useUniqueFileName: true,
        });

        /*
         * Return ImageKit URL
         */
        return res.status(200).json({
            success: true,
            message: "Invoice PDF generated successfully",
            invoiceId: invoice._id,
            invoiceNumber: invoice.invoiceNumber,
            pdfUrl: uploadResponse.url,
        });
    } catch (error) {
        console.error(
            "Download Invoice Error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: "Failed to generate invoice PDF",
            error: error.message,
        });
    }
};

module.exports = {
    downloadInvoice,
};
