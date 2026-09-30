const express = require("express");

const {
  createInvoice, fetchAllInvoices, fetchInvoicesById
} = require("../controller/invoice");

const router = express.Router();

router.post("/", createInvoice);
router.get("/", fetchAllInvoices);
router.get("/:id", fetchInvoicesById);
module.exports = router;