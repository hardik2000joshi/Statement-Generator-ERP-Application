const pdfDocument = require("pdfkit");

// Helpers
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

// ---------------------------------
// TABLE HEADER
// ---------------------------------

function drawTableHeader(doc) {
  const y = doc.y;
  doc
    .font("Helvetica-Bold")
    .fontSize(8);

  doc.text("Date", 40, y, { width: 70 });

  doc.text("Description", 110, y, { width: 150 });

  doc.text("Type", 260, y, { width: 55 });

  doc.text("Amount", 315, y, {
    width: 80,
    align: "right",
  });

  doc.text("Balance", 400, y, {
    width: 110,
    align: "right",
  });

  doc
    .moveTo(40, y + 15)
    .lineTo(550, y + 15)
    .strokeColor("#000000")
    .stroke();

  doc.y = y + 25;
        }

function generateBankStatementPdf(statement){
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfDocument({
                margin: 40,
                size: "A4",
            });
             const chunks = [];
      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.on("error", (error) => {
        reject(error);
      });

      // company header
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .text(statement.company.companyName || "Company");

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(statement.company.address || "");

      doc.text(
        `${statement.company.city || ""}, ${
          statement.company.state || ""
        }, ${statement.company.country || ""}`
      );

      doc.text(
        `Email: ${statement.company.email || ""} | Phone: ${
          statement.company.phone || ""
        }`
      );

      doc.moveDown();

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("BANK STATEMENT");

      doc.moveDown(0.5);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          `Account Number: ${
            statement.accountNumber || ""
          }`
        );

      doc.text(
        `Statement Period: ${formatDate(
          statement.periodStart
        )} - ${formatDate(statement.periodEnd)}`
      );

      doc.moveDown();

      // ---------------------------------
      // BALANCE SUMMARY
      // ---------------------------------

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Statement Summary");

      doc.moveDown(0.3);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          `Opening Balance: INR ${formatAmount(
            statement.openingBalance
          )}`
        );

      doc.text(
        `Closing Balance: INR ${formatAmount(
          statement.closingBalance
        )}`
      );

      doc.text(
        `Total Transactions: ${statement.totalTransactions}`
      );

      doc.moveDown();

      // ---------------------------------
      // TRANSACTION TABLE
      // ---------------------------------

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Transactions");

      doc.moveDown(0.5);

      drawTableHeader(doc);

      let y = doc.y;

      for (const transaction of statement.transactions) {
        // Create a new page if necessary
        if (y > 730) {
          doc.addPage();

          drawTableHeader(doc);

          y = doc.y;
        }

        doc
          .font("Helvetica")
          .fontSize(8);

        doc.text(
          formatDate(transaction.date),
          40,
          y,
          { width: 70 }
        );

        doc.text(
          transaction.description || "",
          110,
          y,
          { width: 150 }
        );

        doc.text(
          transaction.type || "",
          260,
          y,
          { width: 55 }
        );

        doc.text(
          `INR ${formatAmount(transaction.amount)}`,
          315,
          y,
          { width: 80, align: "right" }
        );

        doc.text(
          `INR ${formatAmount(transaction.balance)}`,
          400,
          y,
          { width: 110, align: "right" }
        );

        y += 22;

        doc
          .moveTo(40, y - 5)
          .lineTo(550, y - 5)
          .strokeColor("#dddddd")
          .stroke();
      }

      doc.moveDown(2);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(
          `Closing Balance: INR ${formatAmount(
            statement.closingBalance
          )}`,
          {
            align: "right",
          }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = generateBankStatementPdf;