const mongoose = require("mongoose");
const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VendorCategory",
        required: true,
    },
     outgoingMin: {
      type: Number,
      required: true,
      min: 0,
    },
    outgoingMax: {
      type: Number,
      required: true,
      min: 0,
    },
    incomingMin: {
      type: Number,
      required: true,
      min: 0,
    },
    incomingMax: {
      type: Number,
      required: true,
      min: 0,
    },
    weekendActivity: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
},  {
    timestamps: true,
  })
  const vendorModel = mongoose.model("Vendor", vendorSchema);
module.exports = vendorModel;