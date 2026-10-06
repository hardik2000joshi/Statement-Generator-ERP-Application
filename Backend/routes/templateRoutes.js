const express = require("express");
const {createTemplate, getAllTemplates, getTemplateById, updateTemplate, deleteTemplate} = require("../controller/templates");
const router = express.Router();
router.post("/", createTemplate);
router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

module.exports = router;