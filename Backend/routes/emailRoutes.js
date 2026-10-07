const express = require("express");
const {sendTestEmail} = require("../controller/emailController");
const {sendStatementEmail}= require("../controller/sendStatementEmail");
const router = express.Router();
router.post("/test", sendTestEmail);
router.post("/send-statement", sendStatementEmail);
module.exports = router;