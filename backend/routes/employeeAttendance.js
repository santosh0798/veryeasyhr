const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { upload } = require("../middleware/fileupload");
const {
  newEmployeesAttendance,
  myEmployeesAttendance,
  allEmployeesAttendance,
  updateEmployeeOvertime,
  updateEmployeeAvailLeave,
  myEmployeeAttendance,
  attendancecsv,
  EmployeeOvertime,
  attendancecsvBulk,
  myEmployeesLeaves,
  myEmployeesBonus,
} = require("../controllers/attendanceControllers");

router
  .route("/employee/attendance")
  .post(isAuthenticatedUser, newEmployeesAttendance);
router
  .route("/employee/attendance/mylist/:month/:year")
  .get(isAuthenticatedUser, myEmployeesAttendance);
router
  .route("/employee/attendance/mylist/:year")
  .get(isAuthenticatedUser, myEmployeesLeaves);
router
  .route("/employee/attendance/updateovertime")
  .post(isAuthenticatedUser, EmployeeOvertime);
router
  .route("/employee/attendance/mylist/:month/:year/:employee")
  .get(isAuthenticatedUser, myEmployeeAttendance);
router
  .route("/admin/employee/attendance/allEmployees")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allEmployeesAttendance);
router
  .route("/employee/attendance/overtime")
  .post(isAuthenticatedUser, updateEmployeeOvertime);
router
  .route("/employee/attendance/csv")
  .post(upload.single("file"), isAuthenticatedUser, attendancecsv);
router
  .route("/employee/attendance/csvbulk")
  .post(upload.single("file"), isAuthenticatedUser, attendancecsvBulk);

router
  .route("/employee/attendance/availleave")
  .post(isAuthenticatedUser, updateEmployeeAvailLeave);

router
  .route("/employee/bonus/mylist/:year")
  .get(isAuthenticatedUser, myEmployeesBonus);

module.exports = router;
