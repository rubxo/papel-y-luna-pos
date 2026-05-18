const router = require("express").Router();
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const controller = require("../controllers/report.controller");

router.use(authRequired, requireRole("admin"));
router.get("/dashboard", controller.dashboard);
router.get("/sales", controller.salesReport);
router.get("/products", controller.topProducts);
router.get("/inventory", controller.inventoryReport);
router.get("/purchases", controller.purchasesReport);
router.get("/missing", controller.missingReport);

module.exports = router;
