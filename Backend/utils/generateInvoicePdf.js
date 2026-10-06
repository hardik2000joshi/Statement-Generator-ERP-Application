const PDFDocument = require("pdfkit");

function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN");
}

function formatAmount(amount) {
    return Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function generateInvoicePDF(invoice) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 50,
            });

            const chunks = [];

            doc.on("data", (chunk) => {
                chunks.push(chunk);
            });

            doc.on("end", () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });

            doc.on("error", reject);

            const company = invoice.company || {};
            const bankDetails = company.bankDetails || {};

            /*
             * HEADER
             */
            doc
                .fontSize(20)
                .font("Helvetica-Bold")
                .text("INVOICE", {
                    align: "center",
                });

            doc.moveDown(1);

            /*
             * COMPANY DETAILS
             */
            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text(company.companyName || "Company");

            doc
                .fontSize(10)
                .font("Helvetica")
                .text(company.address || "")
                .text(
                    `${company.city || ""}${
                        company.city && company.state ? ", " : ""
                    }${company.state || ""}${
                        company.country ? `, ${company.country}` : ""
                    }`
                )
                .text(`Email: ${company.email || ""}`)
                .text(`Phone: ${company.phone || ""}`);

            doc.moveDown(1);

            /*
             * INVOICE INFORMATION
             */
            doc
                .fontSize(10)
                .font("Helvetica-Bold")
                .text(`Invoice Number: ${invoice.invoiceNumber || ""}`);

            doc
                .font("Helvetica")
                .text(`Issue Date: ${formatDate(invoice.createdAt)}`)
                .text(`Period Start: ${formatDate(invoice.periodStart)}`)
                .text(`Period End: ${formatDate(invoice.periodEnd)}`);

            doc.moveDown(1);

            /*
             * BILL TO
             *
             * Vendor is the party associated with the transaction.
             * We use the first transaction's vendor here for now.
             */
            const firstTransaction = invoice.transactions?.[0];

            const billTo =
                firstTransaction?.vendor?.name || "N/A";

            doc
                .fontSize(12)
                .font("Helvetica-Bold")
                .text("BILL TO");

            doc
                .fontSize(10)
                .font("Helvetica")
                .text(billTo);

            doc.moveDown(1);

            /*
             * TABLE HEADER
             */
            const tableTop = doc.y;

            const col = {
                no: 50,
                description: 85,
                quantity: 330,
                rate: 400,
                total: 480,
            };

            doc
                .fontSize(9)
                .font("Helvetica-Bold");

            doc.text("#", col.no, tableTop);
            doc.text("Description", col.description, tableTop);
            doc.text("Qty", col.quantity, tableTop);
            doc.text("Rate (INR)", col.rate, tableTop);
            doc.text("Total (INR)", col.total, tableTop);

            doc
                .moveTo(50, tableTop + 15)
                .lineTo(545, tableTop + 15)
                .stroke();

            /*
             * TRANSACTIONS
             */
            let y = tableTop + 25;

            const transactions = invoice.transactions || [];

            transactions.forEach((transaction, index) => {
                const description =
                    transaction.description ||
                    transaction.vendor?.name ||
                    "Transaction";

                const amount = Number(transaction.amount || 0);

                doc
                    .fontSize(9)
                    .font("Helvetica");

                doc.text(String(index + 1), col.no, y);

                doc.text(description, col.description, y, {
                    width: 230,
                });

                doc.text("1", col.quantity, y);

                doc.text(
                    formatAmount(amount),
                    col.rate,
                    y
                );

                doc.text(
                    formatAmount(amount),
                    col.total,
                    y
                );

                y += 25;

                /*
                 * Add another page if necessary.
                 */
                if (y > 730) {
                    doc.addPage();
                    y = 60;
                }
            });

            /*
             * TOTAL
             */
            y += 10;

            doc
                .moveTo(350, y)
                .lineTo(545, y)
                .stroke();

            y += 15;

            doc
                .fontSize(11)
                .font("Helvetica-Bold")
                .text(
                    `Total Amount: ₹${formatAmount(
                        invoice.totalAmount
                    )}`,
                    350,
                    y,
                    {
                        width: 195,
                        align: "right",
                    }
                );

            /*
             * PAYMENT DETAILS
             */
            y += 45;

            doc
                .fontSize(11)
                .font("Helvetica-Bold")
                .text("Payment Details", 50, y);

            y += 18;

            doc
                .fontSize(9)
                .font("Helvetica")
                .text(
                    `Bank Name: ${bankDetails.bankName || ""}`,
                    50,
                    y
                )
                .text(
                    `Account Number: ${
                        bankDetails.accountNumber || ""
                    }`,
                    50,
                    y + 15
                )
                .text(
                    `IFSC Code: ${bankDetails.ifscCode || ""}`,
                    50,
                    y + 30
                );

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generateInvoicePDF,
    formatDate,
    formatAmount,
};