const express = require("express");
const {createCompany, getCompany, getAllCompanies, updateCompany, deleteCompany} = require("../controller/companies");
const router = express.Router();

// Create Company
router.post("/", createCompany);
router.get("/:id", getCompany);
router.get("/", getAllCompanies);
router.patch("/:id", updateCompany);
router.delete("/:id", deleteCompany);
module.exports = router;