const router = require("express").Router();
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const controller = require("../controllers/missing-request.controller");

router.use(authRequired);
router.get("/", controller.list);
router.get("/frequent", controller.frequent);
router.post("/", controller.create);
router.patch("/:id", controller.updateStatus);
router.delete("/:id", requireRole("admin"), controller.remove);

module.exports = router;
