const express = require("express");
const { generateBankStatement, getBankStatement } = require("../controller/generator");
const router = express.Router();
router.post("/", generateBankStatement);
router.get("/:id", getBankStatement)
module.exports = router;