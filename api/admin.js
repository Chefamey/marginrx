const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const defaultUser = "chef";
const defaultPasswordHash = "6351d737affdeab36d2dddd473cdb0e68605dfc02422b14558df99e2312f364f";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function authConfig() {
  return {
    user: process.env.ADMIN_USER || defaultUser,
    passwordHash: process.env.ADMIN_PASSWORD_HASH || (process.env.ADMIN_PASSWORD ? hashPassword(process.env.ADMIN_PASSWORD) : defaultPasswordHash)
  };
}

function parseBasicAuth(header) {
  if (!header || !header.startsWith("Basic ")) return null;

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return {
      user: decoded.slice(0, separator),
      password: decoded.slice(separator + 1)
    };
  } catch (error) {
    return null;
  }
}

function authorized(req) {
  const credentials = parseBasicAuth(req.headers.authorization);
  const config = authConfig();
  if (!credentials) return false;
  return safeEqual(credentials.user, config.user) && safeEqual(hashPassword(credentials.password), config.passwordHash);
}

function sendUnauthorized(res) {
  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", 'Basic realm="MarginRx Admin", charset="UTF-8"');
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("MarginRx admin authentication required.");
}

function readIndexHtml() {
  const candidates = [
    path.join(process.cwd(), "index.html"),
    path.join(__dirname, "..", "index.html")
  ];
  const htmlPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!htmlPath) throw new Error("index.html not found");
  return fs.readFileSync(htmlPath, "utf8");
}

module.exports = function admin(req, res) {
  if (!authorized(req)) {
    sendUnauthorized(res);
    return;
  }

  const html = readIndexHtml();
  res.statusCode = 200;
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.end(html);
};

module.exports._test = {
  hashPassword,
  parseBasicAuth,
  authorized
};
