const router = require("express").Router();
const validate = require("../middlewares/validate.middleware");
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const controller = require("../controllers/sale.controller");
const { createSaleSchema, refundSaleSchema } = require("../validators/sale.validator");

router.use(authRequired);
router.get("/", controller.listSales);
router.get("/:id", controller.getSale);
router.post("/", validate(createSaleSchema), controller.create);
router.post("/:id/refunds", requireRole("admin"), validate(refundSaleSchema), controller.refund);
router.post("/:id/cancel", requireRole("admin"), controller.cancel);
router.post("/:id/correct", requireRole("admin"), controller.correct);
router.patch("/:id", requireRole("admin"), controller.update);

module.exports = router;
