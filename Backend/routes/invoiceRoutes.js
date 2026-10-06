const express = require("express");

const {
  createInvoice, fetchAllInvoices, fetchInvoicesById
} = require("../controller/invoice");
const {downloadInvoice} = require("../controller/downloadInvoice");
const router = express.Router();

router.post("/", createInvoice);
router.get("/", fetchAllInvoices);
router.get("/:id", fetchInvoicesById);
router.get("/:id/download", downloadInvoice);
module.exports = router;