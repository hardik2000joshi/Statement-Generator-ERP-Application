const express = require("express");
const {sendTestEmail} = require("../controller/emailController");
const router = express.Router();
router.post("/test", sendTestEmail);
module.exports = router;