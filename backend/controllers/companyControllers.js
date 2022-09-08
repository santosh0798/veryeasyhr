const Company = require("../models/company");
const ErrorHandler = require("../utilis/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Update New Task => api/v1/company/update
exports.updateCompany = catchAsyncErrors(async (req, res, next) => {
  const {
    companyName,
    companyAddress,
    bonusPercentage,
    minimumWages,
    bonasFrom,
    designation,
  } = req.body;

  console.log(
    companyName,
    companyAddress,
    bonusPercentage,
    minimumWages,
    bonasFrom,
    designation
  );

  const user = await Company.updateOne(
    { user: req.user.id },
    {
      companyName,
      companyAddress,
      bonusPercentage,
      $push: {
        wages: {
          minimumWages,
          bonasFrom,
          designation,
        },
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Company Updates Successfully",
    user,
  });
});

// Get logged in user company   =>   /api/v1/company/mylist

exports.myCompany = catchAsyncErrors(async (req, res, next) => {
  const user = await Company.findOne({ user: req.user.id });

  res.status(200).json({
    success: true,
    user,
  });
});

// Get user company   =>   /api/v1/company/mylist/:id

exports.companyList = catchAsyncErrors(async (req, res, next) => {
  const user = await Company.findOne({ user: req.params.id });

  res.status(200).json({
    success: true,
    user,
  });
});
// //Delete Task => api/v1/task/delete/:id

// exports.deleteTask = catchAsyncErrors(async (req, res, next) => {
//   const task = await Todo.findById(req.params.id);

//   if (!task) {
//     return next(new ErrorHandler("Task Not Found", 400));
//   }

//   await task.remove();

//   res.status(200).json({
//     success: true,
//     message: "Task Deleted Successfully",
//   });
// });
