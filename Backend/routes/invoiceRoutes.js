const express = require("express");

const {
  createInvoice
} = require("../controller/invoice");

const router = express.Router();

router.post("/", createInvoice);
module.exports = router;