const router = require("express").Router();
const multer = require("multer");
const upload = multer();

const adminController = require("../controller/adminController");
const adminValidation = require("../validation/AdminValidation");
const workerController = require("../controller/workerController");
const workerValidation = require("../validation/WorkerValidation");
const salaryController = require("../controller/salaryController");
const attendanceController = require("../controller/attendanceController");
const WorkingHoursController = require("../controller/workingHoursController");

// ADMIN
router.get("/admin/all", adminController.getAdmins);
router.post("/admin/create", adminValidation, adminController.createAdmin);
router.post("/admin/login", adminController.login);
router.delete("/admin/delete/:id", adminController.deleteAdmin);
router.put("/admin/update/:id", adminController.updateAdmin);

// WORKER
router.get("/worker/all", workerController.getWorkers);
router.post(
  "/worker/create",
  upload.single("image"),
  workerValidation,
  workerController.createWorker
);
router.delete("/worker/delete/:id", workerController.deleteWorker);
router.put("/worker/update/:id", workerController.updateWorker);

// ATTENDANCE => DAVOMAT
router.get("/attendance/all", attendanceController.getAll);
router.get("/attendance/date/:date", attendanceController.getByDate);
router.get("/attendance/monthly/:year/:month", attendanceController.getMonthlyAttendance);
router.post("/attendance/create", attendanceController.create);
router.put("/attendance/update/:id", attendanceController.update);


// Working Hours
router.post("/workingHours/create", WorkingHoursController.createWorkingHours);
router.get("/workingHours/", WorkingHoursController.getAllWorkingHours);
router.get("/workingHours/:id", WorkingHoursController.getWorkingHoursById);
router.put("/workingHours/:id", WorkingHoursController.updateWorkingHours);
router.delete("/workingHours/:id", WorkingHoursController.deleteWorkingHours);


// Salaries
router.post("/salaries", salaryController.createSalary);
router.get("/salaries", salaryController.getAllSalaries);
router.get("/salaries/:id", salaryController.getSalaryById);
router.put("/salaries/:id", salaryController.updateSalary);
router.delete("/salaries/:id", salaryController.deleteSalary);

module.exports = router;
