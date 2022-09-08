const Employee = require("../models/employees");

const ErrorHandler = require("../utilis/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utilis/APIFeatures");
const fs = require("fs");
const csv = require("fast-csv");

// Create New Employee => api/v1/employees/new
exports.newEmployees = catchAsyncErrors(async (req, res, next) => {
  const {
    personalDetails,
    companyDetails,
    salaryDetails,
    bankDetails,
    pfDetails,
  } = req.body;
  console.log(req.body);
  const employee = await Employee.create({
    personalDetails,
    companyDetails,
    salaryDetails,
    bankDetails,
    pfDetails,
    createdAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "Employee Added Successfully",
    employee,
  });
});

// Get single Employee   =>   /api/v1/employee/:id
exports.getSingleEmployee = catchAsyncErrors(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id).populate("user");

  if (!employee) {
    return next(new ErrorHandler("No Employee found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    employee,
  });
});

// Get logged in user Employee   =>   /api/v1/employees/mylist

exports.myEmployees = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log(req.query.limit);
    const resPerPage = parseInt(req.query.limit) || 10;
    console.log(resPerPage);

    const employeeCount = await Employee.countDocuments({ user: req.user.id }); //Passing the data into frontend
    const apiFeatures = new APIFeatures(
      Employee.find({ user: req.user.id }),
      req.query
    )
      .search()
      .filter()
      .pagination(resPerPage);
    const employees = await apiFeatures.query;

    res.status(200).json({
      success: true,
      count: employees.length,
      employeeCount,
      employees,
    });
  } catch (err) {
    console.log(err);
  }
});

// Get All Employees | Admin

exports.allEmployees = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 10;
  const employeeCount = await Employee.countDocuments(); //Passing the data into frontend
  const apiFeatures = new APIFeatures(Employee.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const employees = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: employees.length,
    employeeCount,
    employees,
  });
});

exports.allEmployeescsv = catchAsyncErrors(async (req, res, next) => {
  console.log(req.file);
  try {
    if (req.file == undefined) {
      return res.status(400).send({ error: "Please upload a CSV file!" });
    }

    // Import CSV File to MongoDB database

    let csvData = [];

    let filePath = __basedir + "/uploads/" + req.file.filename;
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        console.log(error);
        throw error.message;
      })

      .on("data", (row) => {
        let x = {
          personalDetails: {},
          companyDetails: {},
          salaryDetails: {},
          bankDetails: {},
          pfDetails: {},
          user: req.user.id,
        };
        x.personalDetails["fullName"] = row["Name"];
        x.personalDetails["fatherName"] = row["Father Name"];
        x.personalDetails["mobileNo"] = row["Mobile"];
        x.personalDetails["gender"] = row["Gender"];
        x.personalDetails["dob"] = new Date(row["D.O.B"]);
        x.personalDetails["currentAddress"] = row["Current Address"];
        x.personalDetails["permanentAddress"] = row["Permanent Address"];
        x.companyDetails["UAN"] = row["Uan"];
        x.companyDetails["aadhaarNo"] = row["Aadhaar"];
        x.companyDetails["panNo"] = row["PAN"];
        x.companyDetails["drivingLicense"] = row["DL"];
        x.companyDetails["designation"] = row["Designation"];
        x.companyDetails["joiningDate"] = new Date(row["D.O.J"]);
        x.companyDetails["selectWages"] = row["Wages Mode"];
        x.companyDetails["sickLeave"] = row["Sick Leave"];
        x.companyDetails["casualLeave"] = row["Casual Leave"];
        x.salaryDetails["dailyWages"] = row["Daily Wages"];
        x.salaryDetails["basicSalary"] = row["Basic"];
        x.salaryDetails["hra"] = row["HRA"];
        x.salaryDetails["con"] = row["CON"];
        x.salaryDetails["medical"] = row["Medical"];
        x.salaryDetails["education"] = row["Education"];
        x.salaryDetails["canteen"] = row["Canteen"];
        x.salaryDetails["incomeTax"] = row["Income Tax"];
        x.bankDetails["bankName"] = row["Bank Name"];
        x.bankDetails["ifscCode"] = row["IFSC Code"];
        x.bankDetails["accountNo"] = row["Account Number"];
        x.bankDetails["PFNominee"] = row["PF Nominee"];
        x.bankDetails["gratuityNominee"] = row["Gratuity Nominee"];
        x.bankDetails["leaveNominee"] = row["Leave Nominee"];
        let today = new Date();
        let birth = new Date(row["D.O.B"]);

        x.pfDetails["wereMember"] = row["Member of PF"];
        x.pfDetails["withdrawn"] = row["Withdraw PF"];


        if (row["Basic"] > 15000) {
          x.pfDetails["aboveBasic"] = row["Above Basic"];
        } else if (row["Basic"] < 15000 && row["Above Basic"] != "") {
          return res.status(500).json({
            success: false,
            error: `If ${row["Name"]} basic salary is greater than 15000 then only he/she can opt PF`,
          });
        }

        csvData.push(x);
      })

      .on("end", () => {
        Employee.insertMany(csvData, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: false,
              error: err.message,
            });
          }

          if (result) {
            return res.status(200).send({
              message:
                "Upload/import the CSV data into database successfully:" +
                csvData,
            });
          }
        });
      });
  } catch (error) {
    console.log("catch error-", error);
    return res
      .status(500)
      .send({ error: "Could not upload the file:" + req.file.originalname });
  }
});

// // Get All Employees => api/v1/employees/
// exports.getEmployees = catchAsyncErrors (async (req, res, next) => {
//
//     const resPerPage = 10
//     const employeeCount = await Employee.countDocuments(); //Passing the data into frontend
//
//     const apiFeatures = new APIFeatures(Employee.find(),req.query).search().filter().pagination(resPerPage)
//     const employees = await apiFeatures.query
//
//     res.status(200).json({
//         success: 'true',
//         count: employees.length,
//         employeeCount,
//         employees
//     })
//
// })
//
// //Get Specific Employees => api/v1/employee:id
//
// exports.getSingleEmployee = catchAsyncErrors (async (req, res, next) => {
//
//     const employee = await Employee.findById(req.params.id);
//
//     if (!employee) {
//         return next(new ErrorHandler('Employee Not Found',400))
//     }
//
//     res.status(200).json({
//         success: true,
//         employee
//     })
// })
//

//Update Employee => api/v1/admin/employee/:id

exports.updateEmployee = catchAsyncErrors(async (req, res, next) => {
  let employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found", 400));
  }

  // await employee.save({validateBeforeSave:false})

  employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Update Details Successfully",
    employee,
  });
});

//Delete Employee => api/v1/admin/product/:id

exports.deleteEmployee = catchAsyncErrors(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found", 400));
  }

  await employee.remove();

  res.status(200).json({
    success: true,
    message: "Employee Deleted Successfully",
  });
});
