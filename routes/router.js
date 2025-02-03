const router = require("express").Router();
const multer = require("multer");
const upload = multer();

const adminController = require("../controller/adminController");
const adminValidation = require("../validation/AdminValidation");

const workerController = require("../controller/workerController");
const workerValidation = require("../validation/WorkerValidation");

const attendanceController = require("../controller/attendanceController");

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

module.exports = router;
