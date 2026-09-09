 const companyModel = require("../models/companyModel");
 async function createCompany(req, res){
try {
    const {companyName, registrationNumber, gstNumber, panNumber, email, phone, address, city, state, country, industryType, bankDetails} = req.body;
    if(!companyName || !registrationNumber || !email || !phone || !address || !city || !state || !country){
        return res.status(400).json({
            success: false,
            message: "Company fields are missing",
                 });
    }

    // create company:
    const company = await companyModel.create({
        companyName,
        registrationNumber,
        gstNumber,
        panNumber,
        email,
        phone,
        address,
        city,
        state,
        country,
        industryType,
        bankDetails,
    });
    return res.status(201).json({
        success: true,
        message: "Company Created Successfully",
        company,
    });
}
catch(error){
    console.error("Create Company Error: ", error);
    return res.status(500).json({
        success: false,
        message: "Failed to create company",
        error: error.message,
    });
}
}

async function getCompany(req, res){
    try {
        const {id} = req.params;
        const company = await companyModel.findById(id)
        .populate("industryType", "name");
        if(!company){
            return res.status(404).json({
                success: false,
                message: "company not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "company fetched successfully",
            company,
        });
        }
    catch(error){
        console.error("Get Company Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch company",
      error: error.message,
    });
    }
}

async function getAllCompanies(req, res) {
  try {
    const companies = await companyModel
      .find()
      .populate("industryType", "name");

    return res.status(200).json({
      success: true,
      message: "Companies fetched successfully",
      companies,
    });
  } catch (error) {
    console.error("Get All Companies Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
}

module.exports = {createCompany, getCompany, getAllCompanies}