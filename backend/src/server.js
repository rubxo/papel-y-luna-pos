const http = require("http");
const createApp = require("./app");
const env = require("./config/env");
const sequelize = require("./config/database");
const { initSocket } = require("./sockets");

async function start() {
  const app = createApp();
  const server = http.createServer(app);

  initSocket(server);

  try {
    await sequelize.authenticate();
    console.log("Database connection ready");
  } catch (error) {
    console.warn("Database connection failed. Check .env and MySQL.");
    console.warn(error.message);
  }

  server.listen(env.port, () => {
    console.log(`Papel & Luna API running on http://localhost:${env.port}`);
  });
}

start();
