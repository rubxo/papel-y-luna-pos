const router = require("express").Router();
const validate = require("../middlewares/validate.middleware");
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const controller = require("../controllers/purchase.controller");
const { createPurchaseSchema } = require("../validators/purchase.validator");

router.use(authRequired);
router.get("/", requireRole("admin"), controller.listPurchases);
router.post("/", requireRole("admin"), validate(createPurchaseSchema), controller.create);

module.exports = router;
