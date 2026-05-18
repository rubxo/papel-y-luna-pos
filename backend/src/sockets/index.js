const { Server } = require("socket.io");
const env = require("../config/env");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: env.nodeEnv === "development" || env.frontendUrl === "*" ? true : env.frontendUrl,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.emit("connected", { message: "Realtime listo" });
  });

  return io;
}

function emitEvent(event, payload) {
  if (io) io.emit(event, payload);
}

module.exports = { initSocket, emitEvent };
