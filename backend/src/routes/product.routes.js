const router = require("express").Router();
const validate = require("../middlewares/validate.middleware");
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const controller = require("../controllers/product.controller");
const { idParamSchema } = require("../validators/common.validator");
const { createProductSchema, updateProductSchema } = require("../validators/product.validator");

router.use(authRequired);
router.get("/", controller.listProducts);
router.get("/low-stock", controller.listLowStock);
router.post("/", requireRole("admin"), validate(createProductSchema), controller.createProduct);
router.patch("/:id", requireRole("admin"), validate(updateProductSchema), controller.updateProduct);
router.delete("/:id", requireRole("admin"), validate(idParamSchema), controller.deleteProduct);

module.exports = router;
