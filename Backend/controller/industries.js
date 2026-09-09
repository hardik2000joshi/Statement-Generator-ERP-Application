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
        if(req.params.id){
            const industry = await industryModel.findById(req.params.id);
        }
        if(!industry){
            return res.status(404).json({
                success: false,
                message: "Industry not found"
            })
        }
    }
    catch(error){

    }
}

module.exports = {createIndustry}