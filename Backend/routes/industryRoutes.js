const express = require("express");
const {createIndustry} = require("../controller/industries");
const router = express.Router();
router.post("/", createIndustry);
module.exports = router;