const express = require("express");
const { generateBankStatement, getBankStatement, getAllBankStatement } = require("../controller/generator");
const {downloadBankStatement} = require("../controller/generateBankStatement");
const router = express.Router();
router.post("/", generateBankStatement);
router.get("/:id", getBankStatement);
router.get("/", getAllBankStatement);
router.get("/:id/download", downloadBankStatement);

module.exports = router;