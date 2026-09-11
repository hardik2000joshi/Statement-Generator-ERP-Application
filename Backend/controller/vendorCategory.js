const categoryModel = require("../models/categoryModel");
// create category
async function createCategory(req, res){
    try {
        const {name, description, categoryType, colorTheme} = req.body;
        if(!name || !description || !categoryType || !colorTheme){
            return res.status(400).json({
                success: false,
                message: "Name, description, categoryType and color theme are required",
            });
        }
        const existingCategory = await categoryModel.findOne({
            name: name.trim(),
        });
        if(existingCategory){
            return res.status(409).json({
                success: false,
                message: "vendor category already exists",
            });
        }
        const category = await categoryModel.create({
            name: name.trim(),
            description: description.trim(),
            categoryType,
            colorTheme,
        });
        return res.status(201).json({
            success: true,
            message: "Vendor Category Created Successfully",
            category,
        })
    }
    catch(error){
        console.error("Create Vendor Category Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message,
        });
    }
}

// get all categories:
async function getAllCategories(req, res){
    try {
        const categories = await categoryModel.find()
        .sort({createdAt: -1});
        return res.status(200).json({
            success: true,
            message: "Vendor Categries fetched successfully",
            categories,
        });
    }
    catch(error){
        console.error("GET All vendor categries error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch vendor categories",
            error: error.message,
        });
    }
}

async function getCategoryById(req, res){
    try {
        const {id} = req.params;
        const category = await categoryModel.findById(id);
        if(!category){
            return res.status(404).json({
                success: false,
                message: "Vendor Category not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Vendor category fetched successfully",
            category,
        });
            }
            catch(error){
                console.error("Get vendor category error: ", error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch vendor category",
                    error: error.message,
                                });
            }
}

// update category
async function updateCategory(req, res){
    try {
        const {id} = req.params;
        const {
            name,
            description,
            categoryType,
            colorTheme
        } = req.body;
        if(!name || !description || !categoryType || !colorTheme){
            return res.status(400).json({
                success: false,
                message: "Name, description, categoryType and color are required",
            });
        }

        const existingCategory = await categoryModel.findOne({
            name: name.trim(),
            _id: {$ne: id},
        });

        if(existingCategory){
            return res.status(409).json({
                success: false,
                message: "Another vendor category with this name already exists",
            });
        }

        const category = await categoryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name.trim(),
          description: description.trim(),
          categoryType,
          colorTheme,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Vendor category not found",
      });
    }

     return res.status(200).json({
      success: true,
      message: "Vendor category updated successfully",
      category,
    });
    }
    catch(error){
        console.error("Update vendor category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update vendor category",
            error: error.message,
        });
    }
}

// Delete Category
async function deleteCategory(req, res){
    try {
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        if(!category){
            return res.status(404).json({
                success: false,
                message: "Vendor category not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vendor category deleted successfully",
        });
    }
    catch(error){
        console.error("Delete vendor category error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete vendor category",
            error: error.message,
        });
    }
}
module.exports = {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory}