const mongoose = require("mongoose");
const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["BASIC", "DETAILED", "MINIMAL"],
      unique: true,
    },

     subject: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    // description: {
    //   type: String,
    //   trim: true,
    //   default: "",
    // },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const templateModel = mongoose.model("Template", templateSchema);
module.exports = templateModel;