const express = require("express");
const {createCompany, getCompany, getAllCompanies} = require("../controller/companies");
const router = express.Router();

// Create Company
router.post("/", createCompany);
router.get("/:id", getCompany);
router.get("/", getAllCompanies);
module.exports = router;