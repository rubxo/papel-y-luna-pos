const { authRequired, requireRole } = require("../middlewares/auth.middleware");

function simpleRoutes(controller) {
  const router = require("express").Router();
  router.use(authRequired);
  router.get("/", controller.list);
  router.post("/", requireRole("admin"), controller.create);
  router.patch("/:id", requireRole("admin"), controller.update);
  router.delete("/:id", requireRole("admin"), controller.remove);
  return router;
}

module.exports = simpleRoutes;
