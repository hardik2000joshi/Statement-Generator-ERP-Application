const express = require("express");
const {authenticateUser, authAdminMiddleware} = require("../middleware/authMiddleware");
const {createCompany, getCompany, getAllCompanies, updateCompany, deleteCompany} = require("../controller/companies");
const router = express.Router();

router.use(authenticateUser, authAdminMiddleware);
// Create Company
router.post("/", createCompany);
router.get("/:id", getCompany);
router.get("/", getAllCompanies);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);
module.exports = router;
