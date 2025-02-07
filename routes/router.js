const router = require("express").Router();
const multer = require("multer");
const upload = multer();
const upload2 = multer();

const adminController = require("../controller/adminController");
const adminValidation = require("../validation/AdminValidation");
const workerController = require("../controller/workerController");
const workerValidation = require("../validation/WorkerValidation");
const salaryController = require("../controller/salaryController");
const attendanceController = require("../controller/attendanceController");
const WorkingHoursController = require("../controller/workingHoursController");
const ExpenseController = require("../controller/expenseController");
const OrderController = require("../controller/orderController");

const storeController = require("../controller/storeController");
const storeValidation = require("../validation/StoreValidation");

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
router.get(
  "/attendance/monthly/:year/:month",
  attendanceController.getMonthlyAttendance
);
router.post("/attendance/create", attendanceController.create);
router.put("/attendance/update/:id", attendanceController.update);

// STORE
router.get("/store/all", storeController.getStore);
router.post("/store/create", storeValidation, storeController.createStore);
router.delete("/store/delete/:id", storeController.deleteStore);
router.put("/store/update/:id", storeController.updateStore);
router.get("/store/category/:category", storeController.getStoreByCategory);
router.put("/store/decrement/:id", storeController.decrementQuantity);

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

// Expenses
router.post("/expenses", ExpenseController.createExpense);
router.get("/expenses", ExpenseController.getAllExpenses);
router.get("/expenses/:id", ExpenseController.getExpenseById);
router.put("/expenses/:id", ExpenseController.updateExpense);
router.delete("/expenses/:id", ExpenseController.deleteExpense);
router.post("/expenses/period", ExpenseController.getExpensesByPeriod);

// Orders
router.get("/order/", OrderController.getOrders);
router.get("/order/:id", OrderController.getOrderById);
router.post("/order/", upload2.single("image"), OrderController.createOrder);
router.put("/order/:id", OrderController.updateOrder);
router.delete("/order/:id", OrderController.deleteOrder);

module.exports = router;
