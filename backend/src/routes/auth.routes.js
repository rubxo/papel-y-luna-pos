const router = require("express").Router();
const validate = require("../middlewares/validate.middleware");
const { authRequired } = require("../middlewares/auth.middleware");
const controller = require("../controllers/auth.controller");
const { loginSchema } = require("../validators/auth.validator");

router.post("/login", validate(loginSchema), controller.login);
router.post("/logout", controller.logout);
router.get("/me", authRequired, controller.me);

module.exports = router;
