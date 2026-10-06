const templateModel = require("../models/templates");

// create template
const createTemplate = async (req, res) => {
  try {
    const { name, type, subject, body} = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and template type are required",
      });
    }

    const existingTemplate = await templateModel.findOne({ type });

    if (existingTemplate) {
      return res.status(409).json({
        success: false,
        message: `${type} template already exists`,
      });
    }

    const template = await templateModel.create({
      name,
      type,
      subject,
      body
    });

    return res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error) {
    console.error("Create template error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create template",
      error: error.message,
    });
  }
};

// Get All Templates
const getAllTemplates = async(req, res) => {
  try {
    const templates = await templateModel.find().sort({
      createdAt: -1,
    });
     return res.status(200).json({
      success: true,
      message: "Templates fetched successfully",
      data: templates,
    });
  }
  catch(error){
    console.error("Get all templates error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: error.message,
    });
  }
}

const getTemplateById = async(req, res) => {
try {
  const {id} = req.params;
  const template = await templateModel.findById(id);
  if(!template){
    return res.status(404).json({
      success: false,
      message: "Template Not found",
    });
  }
  return res.status(200).json({  // 200 - Request successful
    success: true,
    message: "Template fetched successfully",
    data: template,
  });
}
catch(error){
  console.error("Get template error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch template",
      error: error.message,
    });
}
}

// update template
const updateTemplate = async(req, res) => {
  try {
    const {id} = req.params;
    const {name, type, subject, body} = req.body;
    const template = await templateModel.findById(id);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    if (name !== undefined) {
      template.name = name;
    }

    if (type !== undefined) {
      template.type = type;
    }

    if (subject !== undefined) {
      template.subject = subject;
    }

    if (body !== undefined) {
      template.body = body;
    }

    await template.save();

    return res.status(200).json({
      success: true,
      message: "Template updated successfully",
      data: template,
    });
  }
  catch(error){
    console.error("Update template error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update template",
      error: error.message,
    })
}
}

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await templateModel.findByIdAndDelete(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template deleted successfully",
    });
  } 
  catch (error) {
    console.error("Delete template error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete template",
      error: error.message,
    });
  }
};
module.exports = {createTemplate, getAllTemplates, getTemplateById, updateTemplate, deleteTemplate}