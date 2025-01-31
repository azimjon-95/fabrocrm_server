const router = require("express").Router();
const adminController = require("../controller/adminController");
const adminValidation = require("../validation/AdminValidation");

const workerController = require("../controller/workerController");
const workerValidation = require("../validation/WorkerValidation");

// ADMIN
router.get("/admin/all", adminController.getAdmins);
router.post("/admin/create", adminValidation, adminController.createAdmin);
router.post("/admin/login", adminController.login);
router.delete("/admin/delete/:id", adminController.deleteAdmin);
router.put("/admin/update/:id", adminController.updateAdmin);

// WORKER
router.get("/worker/all", workerController.getWorkers);
router.post("/worker/create", workerValidation, workerController.createWorker);
router.delete("/worker/delete/:id", workerController.deleteWorker);
router.put("/worker/update/:id", workerController.updateWorker);
module.exports = router;
