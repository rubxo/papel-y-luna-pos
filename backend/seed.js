const path = require("path");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const sequelize = require(path.join(__dirname, "../backend/src/config/database"));
const { User, Role, Category, Product, Customer, Supplier, Setting } = require(path.join(__dirname, "../backend/src/models"));

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Seeding database manually...");

    // Raw cleanup to bypass FKs in correct order or just truncate all
    await sequelize.query("PRAGMA foreign_keys = OFF");
    const tables = ["sale_items", "sales", "purchase_items", "purchases", "products", "categories", "users", "roles", "settings", "customers", "suppliers"];
    for (const table of tables) {
      await sequelize.query(`DELETE FROM ${table}`);
    }
    await sequelize.query("PRAGMA foreign_keys = ON");

    const roles = {
      admin: randomUUID(),
      cajero: randomUUID()
    };

    await Role.bulkCreate([
      { id: roles.admin, name: "admin", label: "Administrador" },
      { id: roles.cajero, name: "cajero", label: "Cajero" }
    ]);

    await User.bulkCreate([
      { 
        id: randomUUID(), 
        roleId: roles.admin, 
        fullName: "Administrador Papel & Luna", 
        username: "admin", 
        passwordHash: await bcrypt.hash("admin123", 10), 
        active: true,
        permissions: JSON.stringify(["home","pos","history","missing","clientes","products","categorias","compras","proveedores","reports","users"])
      },
      { 
        id: randomUUID(), 
        roleId: roles.cajero, 
        fullName: "Cajero Principal", 
        username: "cajero", 
        passwordHash: await bcrypt.hash("cajero123", 10), 
        active: true,
        permissions: JSON.stringify(["home","pos","history","missing","clientes"])
      }
    ]);

    const categories = ["Escritura", "Cuadernos y papel", "Arte y dibujo", "Oficina"].map(name => ({
      id: randomUUID(),
      name,
      description: `Productos de ${name.toLowerCase()}`,
      active: true
    }));
    await Category.bulkCreate(categories);

    const products = [
      { name: "Cuaderno 100 hojas", price: 12000, cost: 8000 },
      { name: "Bolígrafo Azul", price: 1500, cost: 800 },
      { name: "Lápiz HB", price: 1000, cost: 500 },
      { name: "Resma de papel", price: 25000, cost: 18000 }
    ].map((p, i) => ({
      id: randomUUID(),
      categoryId: categories[i % categories.length].id,
      code: `PL-${String(i + 1).padStart(4, "0")}`,
      name: p.name,
      salePrice: p.price,
      costPrice: p.cost,
      stock: 50,
      trackInventory: true,
      active: true
    }));
    await Product.bulkCreate(products);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
