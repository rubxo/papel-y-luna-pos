const router = require("express").Router();
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const controller = require("../controllers/user.controller");

// Rutas que cualquier usuario autenticado puede usar (sin requerir admin)
router.get("/me/permissions", authRequired, controller.mePermissions);
router.patch("/me/password", authRequired, controller.meChangePassword);

// Rutas exclusivas de administrador
router.get("/", authRequired, requireRole("admin"), controller.list);
router.post("/", authRequired, requireRole("admin"), controller.create);
router.get("/:id", authRequired, requireRole("admin"), controller.getById);
router.patch("/:id/status", authRequired, requireRole("admin"), controller.toggleStatus);
router.patch("/:id/password", authRequired, requireRole("admin"), controller.changePassword);
router.patch("/:id", authRequired, requireRole("admin"), controller.update);
router.delete("/:id", authRequired, requireRole("admin"), controller.remove);

module.exports = router;
