const EmployeeAttendance = require("../models/attendance");
const ErrorHandler = require("../utilis/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utilis/APIFeatures");
const Employee = require("../models/employees");
const fs = require("fs");
const csv = require("fast-csv");

// Create New EmployeeAttendance or updateAttendance => api/v1/employee/attendance

exports.newEmployeesAttendance = catchAsyncErrors(async (req, res, next) => {
  const {
    UAN,
    fullName,
    mobileNo,
    joiningDate,
    designation,
    dailyWages,
    employeeAttendance,
    attendanceMonth,
    attendanceYear,
  } = req.body;
  //current month employee
  let employeeExist = await EmployeeAttendance.findOne({
    employee: req.body.employee,
    attendanceMonth: attendanceMonth,
    attendanceYear: attendanceYear,
    user: req.user.id,
  });

  //uanemployee
  let myemployee = await Employee.findOne({
    _id: req.body.employee,
  });
  console.log(myemployee);

  //previous month employee

  let prevMonthEmployeeExist = await EmployeeAttendance.findOne({
    employee: req.body.employee,
    attendanceMonth: attendanceMonth - 1,
    attendanceYear: attendanceYear,
    user: req.user.id,
  });
  //previous year employee

  let prevYearEmployeeExist = await EmployeeAttendance.findOne({
    employee: req.body.employee,
    attendanceMonth: 12,
    attendanceYear: attendanceYear - 1,
    user: req.user.id,
  });

  if (employeeExist) {
    let index = -1;
    let prevdate = -1;
    for (let m = 0; m < employeeExist.employeeAttendance.length; m++) {
      if (employeeExist.employeeAttendance[m].date == employeeAttendance.date) {
        index = m;
        break;
      }
    }

    if (employeeAttendance.leave == "Casual Leave") {
      if (parseInt(myemployee.companyDetails.casualLeave) == 0) {
        employeeAttendance.attendance = false;
        employeeAttendance.leave = "";
      } else {
        myemployee.companyDetails.casualLeave =
          parseInt(myemployee.companyDetails.casualLeave) - 1;
      }
    }
    if (employeeAttendance.leave == "Sick Leave") {
      if (parseInt(myemployee.companyDetails.sickLeave) == 0) {
        console.log(myemployee.companyDetails.sickLeave);

        employeeAttendance.attendance = false;
        employeeAttendance.leave = "";
      } else {
        myemployee.companyDetails.sickLeave =
          parseInt(myemployee.companyDetails.sickLeave) - 1;
      }
    }

    if (
      employeeAttendance.attendance == true ||
      employeeAttendance.leave == "Casual Leave" ||
      employeeAttendance.leave == "Sick Leave" ||
      employeeAttendance.leave == "Paid Leave" ||
      employeeAttendance.leave == "Paid Holiday" ||
      employeeAttendance.leave == "Paid Weekly Off" ||
      employeeAttendance.leave == "Accident Leave" ||
      employeeAttendance.leave == "Maternity Leave"
    ) {
      employeeExist.totalPresent += 1;
    } else if (employeeAttendance.attendance == false && index != -1) {
      employeeExist.totalPresent -= 1;
    }
    if (
      employeeExist.totalLeave > 0 &&
      employeeAttendance.leave == "Paid Leave"
    ) {
      employeeExist.carryForward -= 1;
      employeeExist.availLeave += 1;
    }

    //if employee takes leave after paid holiday but date is not one

    if (
      employeeAttendance.date !== 1 &&
      employeeAttendance.attendance === false
    ) {
      for (let m = 0; m < employeeExist.employeeAttendance.length; m++) {
        if (
          employeeExist.employeeAttendance[m].date ==
          employeeAttendance.date - 2
        ) {
          prevdate = m;
          break;
        }
      }

      for (let m = 0; m < employeeExist.employeeAttendance.length; m++) {
        if (
          employeeExist.employeeAttendance[m].date ==
          employeeAttendance.date - 1 &&
          employeeExist.employeeAttendance[m].leave == "Paid Holiday" &&
          employeeExist.employeeAttendance[prevdate].attendance == false
        ) {
          console.log("x");
          employeeExist.employeeAttendance[m].attendance = false;
          employeeExist.employeeAttendance[m].leave = "";
        }
      }
    }

    //if employee takes leave after paid holiday but date is one

    if (
      prevMonthEmployeeExist &&
      employeeAttendance.date === 1 &&
      employeeAttendance.attendance === false &&
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 1
      ].leave == "Paid Holiday" &&
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 2
      ].attendance == false
    ) {
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 1
      ].attendance = false;
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 1
      ].leave = "";
    }

    //if employee takes leave after paid holiday but date is two

    if (
      prevMonthEmployeeExist &&
      employeeAttendance.date === 2 &&
      employeeAttendance.attendance === false &&
      employeeExist.employeeAttendance[0].leave == "Paid Holiday" &&
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 1
      ].attendance == false
    ) {
      employeeExist.employeeAttendance[0].attendance = false;
      employeeExist.employeeAttendance[0].leave = "";
    }

    //change attandance

    if (index != -1) {
      employeeExist.employeeAttendance[index].attendance =
        employeeAttendance.attendance;
      employeeExist.employeeAttendance[index].leave = employeeAttendance.leave;
    }

    if (employeeAttendance != undefined && index == -1) {
      employeeExist.employeeAttendance.push(employeeAttendance);
    }

    employeeExist = await employeeExist.save();
    myemployee = await myemployee.save();

    if (prevMonthEmployeeExist) {
      prevMonthEmployeeExist = await prevMonthEmployeeExist.save();
    }
    res.status(201).json({
      success: true,
      message: "Employee Attendance Added Successfully",
      employeeExist,
    });
  } else {
    let totalleave = 0;
    let totalpresent = 0;
    let carryForward = 0;
    let availLeave = 0;

    let joinDate = new Date(joiningDate);
    let lastDate = new Date(`12/31/${joinDate.getFullYear()}`);
    var Difference_In_Time = lastDate.getTime() - joinDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log(Difference_In_Days);

    if (attendanceMonth == 1 && prevYearEmployeeExist) {
      if (joinDate.getFullYear() == attendanceYear - 1) {
        if (
          joinDate.getFullYear() / 4 == 0 &&
          Difference_In_Days < 366 &&
          prevYearEmployeeExist.totalPresent > (Difference_In_Days * 2) / 3
        ) {
          totalleave =
            parseInt(prevYearEmployeeExist.totalPresent / 20) +
            prevYearEmployeeExist.carryForward;
          carryForward = totalleave;
        } else if (
          joinDate.getFullYear() / 4 != 0 &&
          Difference_In_Days < 365 &&
          prevYearEmployeeExist.totalPresent > (Difference_In_Days * 2) / 3
        ) {
          totalleave =
            parseInt(prevYearEmployeeExist.totalPresent / 20) +
            prevYearEmployeeExist.carryForward;
          carryForward = totalleave;
        }
      } else {
        totalleave =
          parseInt(prevYearEmployeeExist.totalPresent / 20) +
          prevYearEmployeeExist.carryForward;
        carryForward = totalleave;
      }
    } else if (attendanceMonth != 1 && prevMonthEmployeeExist) {
      totalleave = prevMonthEmployeeExist.totalLeave;
      if (employeeAttendance.attendance == true) {
        totalpresent = prevMonthEmployeeExist.totalPresent + 1;
      } else {
        totalpresent = prevMonthEmployeeExist.totalPresent;
      }
      carryForward = prevMonthEmployeeExist.carryForward;
      availLeave = prevMonthEmployeeExist.availLeave;
    }
    if (attendanceMonth == 1 && employeeAttendance.attendance == true) {
      totalpresent += 1;
    }

    const employeeAttendances = await EmployeeAttendance.create({
      UAN: UAN,
      fullName: fullName,
      mobileNo: mobileNo,
      joiningDate: joiningDate,
      dailyWages: dailyWages,
      employee: req.body.employee,
      employeeAttendance: [employeeAttendance],
      attendanceMonth,
      attendanceYear,
      createdAt: Date.now(),
      employee: req.body.employee,
      totalPresent: totalpresent,
      totalLeave: totalleave,
      availLeave: availLeave,
      carryForward: carryForward,
      user: req.user.id,
    });

    //if employee takes leave after paid holiday but date is one

    if (
      prevMonthEmployeeExist &&
      employeeAttendance.date === 1 &&
      employeeAttendance.attendance === false &&
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 1
      ].leave == "Paid Holiday" &&
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 2
      ].attendance == false
    ) {
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 1
      ].attendance = false;
      prevMonthEmployeeExist.employeeAttendance[
        prevMonthEmployeeExist.employeeAttendance.length - 1
      ].leave = "";
    }
    if (prevMonthEmployeeExist) {
      prevMonthEmployeeExist = await prevMonthEmployeeExist.save();
    }
    res.status(200).json({
      success: true,
      message: "Employee Attendance Added Successfully",
      employeeAttendances,
    });
  }
});

// Create New EmployeeAttendance or updateAttendance => api/v1/employee/attendance/updateovertime

exports.EmployeeOvertime = catchAsyncErrors(async (req, res, next) => {
  const { overtime, attendanceMonth, attendanceYear, date } = req.body;

  let employeeExist = await EmployeeAttendance.findOne({
    employee: req.body.employee,
    attendanceMonth: attendanceMonth,
    attendanceYear: attendanceYear,
    user: req.user.id,
  });

  if (employeeExist) {
    let index = -1;
    for (let m = 0; m < employeeExist.employeeAttendance.length; m++) {
      if (employeeExist.employeeAttendance[m].date == date) {
        index = m;
        break;
      }
    }
    if (index != -1) {
      employeeExist.employeeAttendance[index].overtime = overtime;
    }

    employeeExist = await employeeExist.save();
    return res.status(200).json({
      success: true,
      message: "Employee Overtime Added Successfully",
      employeeExist,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Employee Does not exist",
      employeeExist,
    });
  }
});

// Get logged in user Employee attendance  =>   /api/v1/employees/attendance/mylist

exports.myEmployeesAttendance = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = parseInt(req.query.limit) || 10;
  const employeeCount = await EmployeeAttendance.countDocuments(); //Passing the data into frontend
  const apiFeatures = new APIFeatures(
    EmployeeAttendance.find({
      user: req.user.id,
      attendanceMonth: req.params.month,
      attendanceYear: req.params.year,
    }),
    req.query
  )
    .search()
    .filter()
    .pagination(resPerPage);
  const attend = await EmployeeAttendance.find({
    user: req.user.id,
    attendanceMonth: req.params.month,
    attendanceYear: req.params.year,
  });
  const length = attend.length;
  const employeesAttendance = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: employeesAttendance.length,
    employeeCount,
    employeesAttendance,
    length: length,
  });
});

// Get logged in user Employee attendance  =>   /api/v1/employees/attendance/mylist

exports.myEmployeesLeaves = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = parseInt(req.query.limit) || 10;
  const employeeCount = await EmployeeAttendance.countDocuments(); //Passing the data into frontend
  const apiFeatures = new APIFeatures(
    Employee.find({
      user: req.user.id,
    }),
    req.query
  )
    .search()
    .filter()
    .pagination(resPerPage);
  const attend = await EmployeeAttendance.find({
    user: req.user.id,
    attendanceYear: req.params.year,
  });
  const length = attend.length;
  const employeesAttendance = await apiFeatures.query;

  let attendance = [];

  for (let i = 0; i < employeesAttendance.length; i++) {
    let attArr = [];
    let m = await EmployeeAttendance.find({
      user: req.user.id,
      employee: employeesAttendance[i]._id,
      attendanceYear: req.params.year,
    });

    attendance.push({ empData: employeesAttendance[i], attandanceData: m });
  }

  res.status(200).json({
    success: true,
    count: employeesAttendance.length,
    employeeCount,
    attendance,
    length: length,
  });
});

// Get logged in user single Employee attendance  =>   /api/v1/employees/attendance/list/:id

exports.myEmployeeAttendance = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 10;
  const employeeCount = await EmployeeAttendance.countDocuments(); //Passing the data into frontend
  const apiFeatures = new APIFeatures(
    EmployeeAttendance.find({
      user: req.user.id,
      attendanceMonth: req.params.month,
      attendanceYear: req.params.year,
      employee: req.params.employee,
    }),
    req.query
  )
    .search()
    .filter()
    .pagination(resPerPage);
  const employeesAttendance = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: employeesAttendance.length,
    employeeCount,
    employeesAttendance,
  });
});

// Get All Employees | Admin =>/api/v1/admin/employee/attendance/allEmployees

exports.allEmployeesAttendance = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 10;
  const employeeCount = await EmployeeAttendance.countDocuments(); //Passing the data into frontend
  const apiFeatures = new APIFeatures(EmployeeAttendance.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const employeesAttendance = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: employeesAttendance.length,
    employeeCount,
    employeesAttendance,
  });
});

//upload attandance csv file
exports.attendancecsv = catchAsyncErrors(async (req, res, next) => {
  console.log(req.file);
  try {
    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a CSV file!",
      });
    }

    // Import CSV File to MongoDB database

    let csvData = [];

    let filePath = __basedir + "/uploads/" + req.file.filename;
    fs.createReadStream(filePath)
      .pipe(
        csv.parse({
          headers: true,
        })
      )
      .on("error", (error) => {
        throw error.message;
      })

      .on("data", async (row) => {
        //employee
        const employees = await Employee.findOne({
          "companyDetails.aadhaarNo": row.aadhaar,
        });
        console.log(row.aadhaar, employees);

        if (employees) {
          //previous month employee
          let prevMonthEmployeeExist = await EmployeeAttendance.findOne({
            employee: employees._id,
            attendanceMonth: parseInt(row.month) - 1,
            attendanceYear: parseInt(row.year),
            user: req.user.id,
          });

          //previous year employee

          let prevYearEmployeeExist = await EmployeeAttendance.findOne({
            employee: employees._id,
            attendanceMonth: 12,
            attendanceYear: parseInt(row.year) - 1,
            user: req.user.id,
          });

          let employeeExist = await EmployeeAttendance.findOne({
            employee: employees._id,
            attendanceMonth: row.month,
            attendanceYear: row.year,
            user: req.user.id,
          });

          if (employeeExist) {
            //if employee takes leave after paid holiday but date is one

            let attarray = [];
            let index = -1;
            for (let m = 0; m < employeeExist.employeeAttendance.length; m++) {
              if (row[employeeExist.employeeAttendance[m].date] != undefined) {
                index = m;
                break;
              }
            }
            for (let m = 0; m < employeeExist.employeeAttendance.length; m++) {
              if (row[employeeExist.employeeAttendance[m].date] != undefined) {
                attarray.push(employeeExist.employeeAttendance[m].date);
              }
            }
            if (index != -1) {
              switch (row[employeeExist.employeeAttendance[index].date]) {
                case "P":
                  employeeExist.employeeAttendance[index].attendance = true;

                  break;
                case "CL":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave =
                    "Casual Leave";
                  break;
                case "A":
                  employeeExist.employeeAttendance[index].attendance = false;

                  break;
                case "PL":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave = "Paid Leave";
                  break;
                case "SL":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave = "Sick Leave";

                  break;
                case "W":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave = "Weekly Off";
                  break;
                case "LWOP":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave =
                    "Leave without Permission";

                  break;
                case "LWP":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave =
                    "Leave with permission";

                  break;
                case "PH":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave =
                    "Paid Holiday";

                  break;
                case "PWO":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave =
                    "Paid Weekly Off";

                  break;
                case "UPWO":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave =
                    "Unpaid Weekly Off";

                  break;
                case "AL":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave =
                    "Accident Leave";

                  break;
                case "ML":
                  employeeExist.employeeAttendance[index].attendance = false;
                  employeeExist.employeeAttendance[index].leave =
                    "Maternity Leave";

                  break;
                default:
                  employeeExist.employeeAttendance[index].attendance = false;

                  break;
              }
            }

            for (let k = 1; k <= 31; k++) {
              if (row[k] != undefined && attarray.indexOf(k) == -1) {
                let m = {};
                m.date = k;

                switch (row[k]) {
                  case "P":
                    m.attendance = true;

                    break;
                  case "CL":
                    m.attendance = true;
                    m.leave = "Casual Leave";
                    break;
                  case "AL":
                    m.attendance = true;
                    m.leave = "Accident Leave";
                    break;
                  case "ML":
                    m.attendance = true;
                    m.leave = "Maternity Leave";
                    break;
                  case "A":
                    m.attendance = false;

                    break;
                  case "PL":
                    m.attendance = true;
                    m.leave = "Paid Leave";
                    break;
                  case "SL":
                    m.attendance = true;
                    m.leave = "Sick Leave";

                    break;
                  case "W":
                    m.attendance = false;
                    m.leave = "Weekly Off";
                    break;
                  case "LWOP":
                    m.attendance = false;
                    m.leave = "Leave without Permission";

                    break;
                  case "LWP":
                    m.attendance = false;
                    m.leave = "Leave with permission";

                    break;
                  case "PH":
                    m.attendance = true;
                    m.leave = "Paid Holiday";

                    break;
                  case "PWO":
                    m.attendance = true;
                    m.leave = "Paid Weekly Off";

                    break;
                  case "UPWO":
                    m.attendance = false;
                    m.leave = "Unpaid Weekly Off";

                    break;
                  default:
                    m.attendance = false;

                    break;
                }

                let prevdate = -1;

                if (row[k] == "CL") {
                  if (parseInt(employees.companyDetails.casualLeave) == 0) {
                    m.attendance = false;
                    m.leave = "";
                  } else {
                    employees.companyDetails.casualLeave =
                      parseInt(employees.companyDetails.casualLeave) - 1;
                  }
                }
                if (row[k] == "SL") {
                  if (parseInt(employees.companyDetails.sickLeave) == 0) {
                    console.log(employees.companyDetails.sickLeave);

                    m.attendance = false;
                    m.leave = "";
                  } else {
                    employees.companyDetails.sickLeave =
                      parseInt(employees.companyDetails.sickLeave) - 1;
                  }
                }

                if (
                  row[k] == "P" ||
                  row[k] == "CL" ||
                  row[k] == "SL" ||
                  row[k] == "PL" ||
                  row[k] == "PH" ||
                  row[k] == "PWO" ||
                  row[k] == "AL" ||
                  row[k] == "ML"
                ) {
                  employeeExist.totalPresent += 1;
                } else {
                  employeeExist.totalPresent -= 1;
                }
                if (employeeExist.totalLeave > 0 && row[k] == "PL") {
                  employeeExist.carryForward -= 1;
                  employeeExist.availLeave += 1;
                }

                //if employee takes leave after paid holiday but date is not one

                if (k !== 1 && m.attendance === false) {
                  for (
                    let m = 0;
                    m < employeeExist.employeeAttendance.length;
                    m++
                  ) {
                    if (employeeExist.employeeAttendance[m].date == k - 2) {
                      prevdate = m;
                      break;
                    }
                  }

                  for (
                    let m = 0;
                    m < employeeExist.employeeAttendance.length;
                    m++
                  ) {
                    if (
                      employeeExist.employeeAttendance[m].date == k - 1 &&
                      employeeExist.employeeAttendance[m].leave ==
                      "Paid Holiday" &&
                      employeeExist.employeeAttendance[prevdate].attendance ==
                      false
                    ) {
                      console.log("x");
                      employeeExist.employeeAttendance[m].attendance = false;
                      employeeExist.employeeAttendance[m].leave = "";
                    }
                  }
                }

                if (
                  prevMonthEmployeeExist &&
                  k === 1 &&
                  m.attendance === false &&
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 1
                  ].leave == "Paid Holiday" &&
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 2
                  ].attendance == false
                ) {
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 1
                  ].attendance = false;
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 1
                  ].leave = "";
                }

                //if employee takes leave after paid holiday but date is two

                if (
                  prevMonthEmployeeExist &&
                  k === 1 &&
                  m.attendance === false &&
                  employeeExist.employeeAttendance[0].leave == "Paid Holiday" &&
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 1
                  ].attendance == false
                ) {
                  employeeExist.employeeAttendance[0].attendance = false;
                  employeeExist.employeeAttendance[0].leave = "";
                }

                employeeExist.employeeAttendance.push(m);
                // console.log(employeeExist);
              }
            }

            employeeExist = await employeeExist.save();
            employees = await employees.save();

            if (prevMonthEmployeeExist) {
              prevMonthEmployeeExist = await prevMonthEmployeeExist.save();
            }
          } else {
            let empattendance = [];
            console.log(row.aadhaar);

            let totalleave = 0;
            let totalpresent = 0;
            let carryForward = 0;
            let availLeave = 0;

            for (let k = 1; k <= 31; k++) {
              totalleave = 0;
              totalpresent = 0;
              carryForward = 0;
              availLeave = 0;
              if (row[k] != undefined) {
                let m = {};
                m.date = k;
                switch (row[k]) {
                  case "P":
                    m.attendance = true;

                    break;
                  case "CL":
                    m.attendance = true;
                    m.leave = "Casual Leave";
                    break;
                  case "A":
                    m.attendance = false;
                    m.leave = "";
                    break;
                  case "PL":
                    m.attendance = true;
                    m.leave = "Paid Leave";
                    break;
                  case "SL":
                    m.attendance = true;
                    m.leave = "Sick Leave";

                    break;
                  case "W":
                    m.attendance = false;
                    m.leave = "Weekly Off";
                    break;
                  case "LWOP":
                    m.attendance = false;
                    m.leave = "Leave without Permission";

                    break;
                  case "LWP":
                    m.attendance = false;
                    m.leave = "Leave with permission";

                    break;
                  case "PH":
                    m.attendance = true;
                    m.leave = "Paid Holiday";

                    break;
                  case "PWO":
                    m.attendance = true;
                    m.leave = "Paid Weekly Off";

                    break;
                  case "UPWO":
                    m.attendance = false;
                    m.leave = "Unpaid Weekly Off";

                    break;
                  case "AL":
                    m.attendance = true;
                    m.leave = "Accident Leave";
                    break;
                  case "ML":
                    m.attendance = true;
                    m.leave = "Maternity Leave";
                    break;
                  default:
                    m.attendance = false;
                    m.leave = "";

                    break;
                }

                let joinDate = new Date(employees.companyDetails.joiningDate);
                let lastDate = new Date(`12/31/${joinDate.getFullYear()}`);
                var Difference_In_Time =
                  lastDate.getTime() - joinDate.getTime();
                var Difference_In_Days =
                  Difference_In_Time / (1000 * 3600 * 24);
                console.log(Difference_In_Days);

                if (parseInt(row.month) == 1 && prevYearEmployeeExist) {
                  if (joinDate.getFullYear() == parseInt(row.year) - 1) {
                    if (
                      joinDate.getFullYear() / 4 == 0 &&
                      Difference_In_Days < 366 &&
                      prevYearEmployeeExist.totalPresent >
                      (Difference_In_Days * 2) / 3
                    ) {
                      totalleave =
                        parseInt(prevYearEmployeeExist.totalPresent / 20) +
                        prevYearEmployeeExist.carryForward;
                      carryForward = totalleave;
                    } else if (
                      joinDate.getFullYear() / 4 != 0 &&
                      Difference_In_Days < 365 &&
                      prevYearEmployeeExist.totalPresent >
                      (Difference_In_Days * 2) / 3
                    ) {
                      totalleave =
                        parseInt(prevYearEmployeeExist.totalPresent / 20) +
                        prevYearEmployeeExist.carryForward;
                      carryForward = totalleave;
                    }
                  }
                } else if (parseInt(row.month) != 1 && prevMonthEmployeeExist) {
                  totalleave = prevMonthEmployeeExist.totalLeave;
                  if (m.attendance == true) {
                    totalpresent = prevMonthEmployeeExist.totalPresent + 1;
                  } else {
                    totalpresent = prevMonthEmployeeExist.totalPresent;
                  }
                  carryForward = prevMonthEmployeeExist.carryForward;
                  availLeave = prevMonthEmployeeExist.availLeave;
                }
                if (parseInt(row.month) == 1 && m.attendance == true) {
                  totalpresent += 1;
                }

                //if employee takes leave after paid holiday but date is one

                if (
                  prevMonthEmployeeExist &&
                  k === 1 &&
                  m.attendance === false &&
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 1
                  ].leave == "Paid Holiday" &&
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 2
                  ].attendance == false
                ) {
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 1
                  ].attendance = false;
                  prevMonthEmployeeExist.employeeAttendance[
                    prevMonthEmployeeExist.employeeAttendance.length - 1
                  ].leave = "";
                }
                if (prevMonthEmployeeExist) {
                  prevMonthEmployeeExist = await prevMonthEmployeeExist.save();
                }

                empattendance.push(m);
              }
            }
            const employeeAttendances = await EmployeeAttendance.create({
              UAN: row.aadhaar,
              fullName: employees.personalDetails.fullName,
              mobileNo: employees.personalDetails.mobileNo,
              joiningDate: employees.companyDetails.joiningDate,
              dailyWages: employees.companyDetails.dailyWages,
              employee: employees._id,

              totalPresent: totalpresent,
              totalLeave: totalleave,
              availLeave: availLeave,
              carryForward: carryForward,

              employeeAttendance: empattendance,
              overTime: row["OT (Days)"],
              attendanceMonth: row.month,
              attendanceYear: row.year,
              user: req.user.id,
            });
          }
        }
      })

      .on("end", () => {
        return res.status(200).send({
          message:
            "Upload/import the CSV data into database successfully:" + csvData,
        });
      });
  } catch (error) {
    console.log("catch error-", error);
    return res.status(500).send({
      message: "Could not upload the file:" + req.file.originalname,
    });
  }
});

//Update Employee Overtime => api/v1/employee/attendance/overtime

exports.updateEmployeeOvertime = catchAsyncErrors(async (req, res, next) => {
  const { attendanceMonth, attendanceYear, overTime } = req.body;
  let employeeExist = await EmployeeAttendance.findOne({
    employee: req.body.employee,
    attendanceMonth: attendanceMonth,
    attendanceYear: attendanceYear,
  });

  if (!employeeExist) {
    return next(new ErrorHandler("Employee Attendance Not Found", 400));
  }

  employeeExist.overTime = overTime;
  employeeExist = await employeeExist.save();

  res.status(200).json({
    success: true,
    message: "Update overtime Details Successfully",
    employeeExist,
  });
});

//Update Employee => api/v1/employee/attendance/availLeave

exports.updateEmployeeAvailLeave = catchAsyncErrors(async (req, res, next) => {
  const { attendanceMonth, attendanceYear, availLeave, user } = req.body;

  let employeeExist = await EmployeeAttendance.findOne({
    employee: req.body.employee,
    attendanceYear: attendanceYear,
    user: user,
  });

  if (!employeeExist) {
    return next(new ErrorHandler("Employee Attendance Not Found", 400));
  }

  employeeExist.availLeave = availLeave;
  employeeExist = await employeeExist.save();

  res.status(200).json({
    success: true,
    message: "Update Avail Leave Details Successfully",
    employeeExist,
  });
});

//upload attandance csv file bulk
exports.attendancecsvBulk = catchAsyncErrors(async (req, res, next) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a CSV file!",
      });
    }

    // Import CSV File to MongoDB database

    let csvData = [];

    let filePath = __basedir + "/uploads/" + req.file.filename;
    fs.createReadStream(filePath)
      .pipe(
        csv.parse({
          headers: true,
        })
      )
      .on("error", (error) => {
        throw error.message;
      })

      .on("data", async (row) => {
        //employee
        let employees = await Employee.findOne({
          "companyDetails.aadhaarNo": row.aadhaar,
        });

        if (employees) {
          let prevMonthEmployeeExist = await EmployeeAttendance.findOne({
            employee: employees._id,
            attendanceMonth: parseInt(row.month) - 1,
            attendanceYear: parseInt(row.year),
            user: req.user.id,
          });

          //previous year employee

          let prevYearEmployeeExist = await EmployeeAttendance.findOne({
            employee: employees._id,
            attendanceMonth: 12,
            attendanceYear: parseInt(row.year) - 1,
            user: req.user.id,
          });

          let employeeExist = await EmployeeAttendance.findOne({
            employee: employees._id,
            attendanceMonth: row.month,
            attendanceYear: row.year,
            user: req.user.id,
          });

          let overtimehrs = parseInt(row["OT Hours"]);

          if (employeeExist) {
            //if employee takes leave after paid holiday but date is one
            for (let m = 0; m < employeeExist.employeeAttendance.length; m++) {
              let tempArry = {};

              if (employeeExist.employeeAttendance[m].date == m + 1) {
                employeeExist.employeeAttendance[m].attendance = true;
                employeeExist.employeeAttendance[m].leave = "";
                if (overtimehrs >= 6) {
                  employeeExist.employeeAttendance[m].overtime = 6;
                } else if (overtimehrs < 6 && overtimehrs > 0) {
                  employeeExist.employeeAttendance[m].overtime = overtimehrs;
                }
                overtimehrs -= 6;
              } else {
                tempArry.attendance = true;
                tempArry.leave = "";
                tempArry.date = m + 1;
                if (overtimehrs >= 6) {
                  tempArry.overtime = 6;
                } else if (overtimehrs < 6 && overtimehrs > 0) {
                  tempArry.overtime = overtimehrs;
                }
                employeeExist.employeeAttendance.push(tempArry);
                overtimehrs -= 6;
              }
            }

            if (prevMonthEmployeeExist) {
              employeeExist.totalPresent =
                parseInt(row["Present days"]) +
                prevMonthEmployeeExist.totalPresent;
            } else {
              employeeExist.totalPresent = parseInt(row["Present days"]);
            }
            employeeExist = await employeeExist.save();
            employees = await employees.save();
          } else {
            let arr = [];
            let overtimehrs = parseInt(row["OT Hours"]);

            for (let m = 0; m < row["Present days"]; m++) {
              arr.push({
                date: m + 1,
                attendance: true,
                leave: "",
                overtime:
                  overtimehrs >= 6
                    ? 6
                    : overtimehrs < 6 && overtimehrs > 0
                      ? overtimehrs
                      : 0,
              });
              overtimehrs -= 6;
            }

            let employeeAttendances = await EmployeeAttendance.create({
              UAN: row.aadhaar,
              fullName: employees.personalDetails.fullName,
              mobileNo: employees.personalDetails.mobileNo,
              joiningDate: employees.companyDetails.joiningDate,
              dailyWages: employees.companyDetails.dailyWages,
              employee: employees._id,

              totalPresent: prevMonthEmployeeExist
                ? parseInt(row["Present days"]) +
                prevMonthEmployeeExist.totalPresent
                : parseInt(row["Present days"]),
              carryForward: prevMonthEmployeeExist
                ? prevMonthEmployeeExist.carryForward
                : 0,
              totalLeave: prevMonthEmployeeExist
                ? prevMonthEmployeeExist.totalLeave
                : 0,
              availLeave: prevMonthEmployeeExist
                ? prevMonthEmployeeExist.availLeave
                : 0,
              employeeAttendance: arr,

              attendanceMonth: row.month,
              attendanceYear: row.year,
              user: req.user.id,
            });
          }
        }
      })

      .on("end", () => {
        return res.status(200).send({
          message:
            "Upload/import the CSV data into database successfully:" + csvData,
        });
      });
  } catch (error) {
    console.log("catch error-", error);
    return res.status(500).send({
      message: "Could not upload the file:" + req.file.originalname,
    });
  }
});

// Get logged in user Employee bonas  =>   /api/v1/employees/attendance/bonas

exports.myEmployeesBonus = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = parseInt(req.query.limit) || 10;
  const employeeCount = await EmployeeAttendance.countDocuments(); //Passing the data into frontend
  const apiFeatures = new APIFeatures(
    Employee.find({
      user: req.user.id,
    }),
    req.query
  )
    .search()
    .filter()
    .pagination(resPerPage);

  const attend = await EmployeeAttendance.find({
    user: req.user.id,
    attendanceYear: req.params.year,
    attendanceMonth: { $gt: 3 },
  });

  const attendNextYear = await EmployeeAttendance.find({
    user: req.user.id,
    attendanceYear: parseInt(req.params.year) + 1,
    attendanceMonth: { $lt: 4 },
  });

  const length = attend.length + attendNextYear.length;
  const employeesAttendance = await apiFeatures.query;

  let attendance = [];

  for (let i = 0; i < employeesAttendance.length; i++) {
    let attArr = [];
    let m = await EmployeeAttendance.find({
      user: req.user.id,
      employee: employeesAttendance[i]._id,
      $or: [
        {
          attendanceYear: parseInt(req.params.year) + 1,
          attendanceMonth: { $lt: 4 },
        },
        { attendanceYear: req.params.year, attendanceMonth: { $gt: 3 } },
      ],
    });

    attendance.push({ empData: employeesAttendance[i], attandanceData: m });
  }

  res.status(200).json({
    success: true,
    count: employeesAttendance.length,
    employeeCount,
    attendance,
    length: length,
  });
});
