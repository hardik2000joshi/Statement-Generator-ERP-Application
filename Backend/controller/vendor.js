const vendorModel = require("../models/vendorModel");
const categoryModel = require("../models/categoryModel");

// CREATE VENDOR
async function createVendor(req, res) {
  try {
    const {
      name,
      category,
      outgoingMin,   // minimum expense
      outgoingMax,    // maximum expense
      incomingMin,    // minimum income
      incomingMax,     // maximum income
      weekendActivity,
    } = req.body;

    if (
      !name ||
      !category ||
      outgoingMin === undefined ||
      outgoingMax === undefined ||
      incomingMin === undefined ||
      incomingMax === undefined ||
      weekendActivity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All vendor fields are required",
      });
    }

    // Check category exists
    const existingCategory = await categoryModel.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Vendor category not found",
      });
    }

    // Validate ranges
    if (outgoingMin > outgoingMax) {
      return res.status(400).json({
        success: false,
        message: "Outgoing minimum cannot be greater than outgoing maximum",
      });
    }

    if (incomingMin > incomingMax) {
      return res.status(400).json({
        success: false,
        message: "Incoming minimum cannot be greater than incoming maximum",
      });
    }

    if (weekendActivity < 0 || weekendActivity > 100) {
      return res.status(400).json({
        success: false,
        message: "Weekend activity must be between 0 and 100",
      });
    }

    const vendor = await vendorModel.create({
      name: name.trim(),
      category,
      outgoingMin,
      outgoingMax,
      incomingMin,
      incomingMax,
      weekendActivity,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor,
    });
  } catch (error) {
    console.error("Create Vendor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create vendor",
      error: error.message,
    });
  }
}

// GET ALL VENDORS
async function getAllVendors(req, res) {
  try {
    const vendors = await vendorModel
      .find()
      .populate("category", "name categoryType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Vendors fetched successfully",
      vendors,
    });
  } catch (error) {
    console.error("Get All Vendors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
      error: error.message,
    });
  }
}

// GET ONE VENDOR
async function getVendorById(req, res) {
  try {
    const { id } = req.params;

    const vendor = await vendorModel
      .findById(id)
      .populate("category", "name categoryType");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendor fetched successfully",
      vendor,
    });
  } catch (error) {
    console.error("Get Vendor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor",
      error: error.message,
    });
}
}

async function updateVendor(req, res){
    try {
        const {id} = req.params;
        const {name, category, outgoingMin, outgoingMax, incomingMin, incomingMax, weekendActivity} = req.body;
        if(!name || !category || !outgoingMin === undefined || !outgoingMax === undefined || incomingMin === undefined || incomingMax === undefined || weekendActivity === undefined){
            return res.status(400).json({
                success: false,
                message: "All vendor fields are required",
            });
        }
        const existingCategory = await categoryModel.findById(category);
        if(!existingCategory){
            return res.status(404).json({
                success: false,
                message: "Vendor Category not found",
            });
        }

        if(outgoingMin > outgoingMax){
            return res.status(400).json({
                success: false,
                message: "Outgoing minimum cannot be greater than outgoing maximum",
            });
        }

        if(incomingMin > incomingMax){
            return res.status(400).json({
                success: false,
                message: "Incoming minimum cannoyt be greater than incoming maximum",
            });
        }

        if(weekendActivity < 0 || weekendActivity > 100){
            return res.status(400).json({
                success: false,
                message: "Weekend activity must be between 0 and 100",
            });
        }

        const vendor = await vendorModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: name.trim(),
                    category,
                    outgoingMin,
                    outgoingMax,
                    incomingMin,
                    incomingMax,
                    weekendActivity,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        ).populate("category", "name categoryType");
        if(!vendor){
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
            vendor,
        });
    }
    catch(error){
        console.error("Update vendor error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete vendor",
            error: error.message,
        });
    }
}

async function deleteVendor(req, res){
    try {
        const {id} = req.params;
        const vendor = await vendorModel.findByIdAndDelete(id);
        if(!vendor){
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Vendor Deleted Successfully",
        });
    }
    catch(error){
        console.error("Delete vendor Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete vendor",
            error: error.message,
        });
    }
}
module.exports = {createVendor, getAllVendors, getVendorById, updateVendor, deleteVendor}
