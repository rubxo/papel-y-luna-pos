const router = require("express").Router();
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const controller = require("../controllers/user.controller");

router.use(authRequired, requireRole("admin"));
router.get("/", controller.list);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.patch("/:id/password", controller.changePassword);
router.delete("/:id", controller.remove);

module.exports = router;
