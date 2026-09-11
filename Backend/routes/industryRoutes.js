const express = require("express");
const {createIndustry, getIndustry, getAllIndustries, updateIndustry, deleteIndustry} = require("../controller/industries");
const router = express.Router();
router.post("/", createIndustry);
router.get("/:id", getIndustry);
router.get("/", getAllIndustries);
router.patch("/:id", updateIndustry);
router.delete("/:id", deleteIndustry);

module.exports = router;