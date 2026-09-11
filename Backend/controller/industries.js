const industryModel = require("../models/industryModel");
async function createIndustry(req, res){
    try {
        const {name, description} = req.body;  // name and description we gave in request

        // check required fields:
        if(!name || !description){
            return res.status(400).json({  // 400 - bad request
                success: false,
                message: "Name and description are required - please enter name or description",
            })
        }

        // check if industry already exists
        const isIndustryExists = await industryModel.findOne({
            name: name.trim(),
        });

        if(isIndustryExists){
            return  res.status(409).json({ // 409 - duplicate entries
                success: false,
                message: "Industry already exists create any other industry",
            });
        }

        // create industry
        const industry = await industryModel.create({
            name: name.trim(),
            description: description.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Industry Created Successfully",
            industry,
        });
    }
    catch(error){
        console.error("Create Industry Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create industry",
            error: error.message,
        });
    }
}

async function getIndustry(req, res) {
    try {
         const {id} = req.params;
         const industry = await industryModel.findById(id)
            
        if(!industry){
            return res.status(404).json({
                success: false,
                message: "Industry not found"
            });
        }
        return res.status(200).json({
            success: true,
            industry,
        });
    }
    catch(error){
        console.error("Get Industry Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch industry",
            error: error.message,
        });
    }
}

async function getAllIndustries(req, res){
    try {
    const industries = await industryModel.find().sort({
        createdAt: -1,
    });
    return res.status(200).json({
        success: true,
        industries,
    });
}
    catch(error){
        console.error("Get Industry Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch industries",
            error: error.message,
        });
    }
}

async function updateIndustry(req, res){
    try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    // Check duplicate name
    const existingIndustry = await industryModel.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });

    if (existingIndustry) {
      return res.status(409).json({
        success: false,
        message: "Another industry with this name already exists",
      });
    }

    const industry = await industryModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name.trim(),
          description: description.trim(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!industry) {
      return res.status(404).json({
        success: false,
        message: "Industry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Industry updated successfully",
      industry,
    });
  } catch (error) {
    console.error("Update Industry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update industry",
      error: error.message,
    });
  }
}

async function deleteIndustry(req, res){
    try {
        const {id} = req.params;
        const industry = await industryModel.findByIdAndDelete(id);
        if(!industry){
            return res.status(404).json({
                success: false,
                message: "Industry not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Industry deleted successfully",
        });
    }
    catch(error){
        console.error("Delete Indutry Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete industry",
            error: error.message,
        });
    }
}




module.exports = {createIndustry, getIndustry, getAllIndustries, updateIndustry, deleteIndustry}