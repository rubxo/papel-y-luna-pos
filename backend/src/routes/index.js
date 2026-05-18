const router = require("express").Router();
const { sequelize, Category, Customer, Supplier, Discount } = require("../models");
const createCrudController = require("../controllers/simple-crud.controller");

router.get("/health", async (_req, res) => {
  let database = "offline";

  try {
    await sequelize.authenticate();
    database = "online";
  } catch (_error) {
    database = "offline";
  }

  res.json({
    success: true,
    status: "ok",
    database
  });
});

router.use("/auth", require("./auth.routes"));
router.use("/products", require("./product.routes"));
router.use("/sales", require("./sale.routes"));
router.use("/purchases", require("./purchase.routes"));
router.use("/reports", require("./report.routes"));
router.use("/users", require("./user.routes"));

router.use("/categories", require("./simple.routes")(createCrudController(Category, "Categoría", [["name", "ASC"]])));
router.use("/customers", require("./simple.routes")(createCrudController(Customer, "Cliente", [["name", "ASC"]])));
router.use("/suppliers", require("./simple.routes")(createCrudController(Supplier, "Proveedor", [["name", "ASC"]])));
router.use("/discounts", require("./simple.routes")(createCrudController(Discount, "Descuento", [["name", "ASC"]])));
router.use("/missing-requests", require("./missing-request.routes"));

module.exports = router;
