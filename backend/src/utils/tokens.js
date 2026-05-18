const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signAccessToken(user) {
  return jwt.sign(
    {
      role: user.role?.name || user.roleName || undefined,
      username: user.username
    },
    env.jwt.secret,
    {
      subject: String(user.id),
      expiresIn: env.jwt.expiresIn
    }
  );
}

module.exports = { signAccessToken };
