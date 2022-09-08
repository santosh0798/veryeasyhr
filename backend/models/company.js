const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please Enter Company Name"],
  },
  companyAddress: {
    type: String,
  },
  bonusPercentage: {
    type: String,
  },
  wages: [
    {
      minimumWages: {
        type: String,
      },
      bonasFrom: {
        type: Date,
      },
      designation: {
        type: String,
        required: [true, "Please Select Employee Designation"],
        enum: {
          values: ["Skilled", "Semi Skilled", "Un Skilled", "Others"],
          message: "Please select one field from Employee Designation",
        },
      },
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Company", companySchema);
