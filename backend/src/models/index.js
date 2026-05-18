const sequelize = require("../config/database");

const Role = require("./role.model");
const User = require("./user.model");
const Category = require("./category.model");
const Product = require("./product.model");
const Customer = require("./customer.model");
const Supplier = require("./supplier.model");
const Sale = require("./sale.model");
const SaleItem = require("./sale-item.model");
const Purchase = require("./purchase.model");
const PurchaseItem = require("./purchase-item.model");
const Refund = require("./refund.model");
const RefundItem = require("./refund-item.model");
const SaleCorrection = require("./sale-correction.model");
const InventoryMovement = require("./inventory-movement.model");
const AuditLog = require("./audit-log.model");
const Setting = require("./setting.model");
const MissingRequest = require("./missing-request.model");
const RequestLog = require("./request-log.model");
const Discount = require("./discount.model");

Role.hasMany(User, { as: "users", foreignKey: "roleId" });
User.belongsTo(Role, { as: "role", foreignKey: "roleId" });

Category.hasMany(Product, { as: "products", foreignKey: "categoryId" });
Product.belongsTo(Category, { as: "category", foreignKey: "categoryId" });

Customer.hasMany(Sale, { as: "sales", foreignKey: "customerId" });
Sale.belongsTo(Customer, { as: "customer", foreignKey: "customerId" });
User.hasMany(Sale, { as: "sales", foreignKey: "userId" });
Sale.belongsTo(User, { as: "user", foreignKey: "userId" });
Sale.hasMany(SaleItem, { as: "items", foreignKey: "saleId" });
SaleItem.belongsTo(Sale, { as: "sale", foreignKey: "saleId" });
Product.hasMany(SaleItem, { as: "saleItems", foreignKey: "productId" });
SaleItem.belongsTo(Product, { as: "product", foreignKey: "productId" });

Supplier.hasMany(Purchase, { as: "purchases", foreignKey: "supplierId" });
Purchase.belongsTo(Supplier, { as: "supplier", foreignKey: "supplierId" });
User.hasMany(Purchase, { as: "purchases", foreignKey: "userId" });
Purchase.belongsTo(User, { as: "user", foreignKey: "userId" });
Purchase.hasMany(PurchaseItem, { as: "items", foreignKey: "purchaseId" });
PurchaseItem.belongsTo(Purchase, { as: "purchase", foreignKey: "purchaseId" });
Product.hasMany(PurchaseItem, { as: "purchaseItems", foreignKey: "productId" });
PurchaseItem.belongsTo(Product, { as: "product", foreignKey: "productId" });

Sale.hasMany(Refund, { as: "refunds", foreignKey: "saleId" });
Refund.belongsTo(Sale, { as: "sale", foreignKey: "saleId" });
User.hasMany(Refund, { as: "refunds", foreignKey: "userId" });
Refund.belongsTo(User, { as: "user", foreignKey: "userId" });
Refund.hasMany(RefundItem, { as: "items", foreignKey: "refundId" });
RefundItem.belongsTo(Refund, { as: "refund", foreignKey: "refundId" });
SaleItem.hasMany(RefundItem, { as: "refundItems", foreignKey: "saleItemId" });
RefundItem.belongsTo(SaleItem, { as: "saleItem", foreignKey: "saleItemId" });

Sale.hasMany(SaleCorrection, { as: "corrections", foreignKey: "saleId" });
SaleCorrection.belongsTo(Sale, { as: "sale", foreignKey: "saleId" });
User.hasMany(SaleCorrection, { as: "corrections", foreignKey: "userId" });
SaleCorrection.belongsTo(User, { as: "user", foreignKey: "userId" });

Product.hasMany(InventoryMovement, { as: "movements", foreignKey: "productId" });
InventoryMovement.belongsTo(Product, { as: "product", foreignKey: "productId" });
User.hasMany(InventoryMovement, { as: "inventoryMovements", foreignKey: "userId" });
InventoryMovement.belongsTo(User, { as: "user", foreignKey: "userId" });
User.hasMany(AuditLog, { as: "auditLogs", foreignKey: "userId" });
AuditLog.belongsTo(User, { as: "user", foreignKey: "userId" });

User.hasMany(MissingRequest, { as: "missingRequests", foreignKey: "userId" });
MissingRequest.belongsTo(User, { as: "user", foreignKey: "userId" });

module.exports = {
  sequelize,
  Role,
  User,
  Category,
  Product,
  Customer,
  Supplier,
  Sale,
  SaleItem,
  Purchase,
  PurchaseItem,
  Refund,
  RefundItem,
  SaleCorrection,
  InventoryMovement,
  AuditLog,
  Setting,
  MissingRequest,
  RequestLog,
  Discount
};
