const jwt = require("jsonwebtoken");

async function accessResource(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ status: "fail", message: "unauthenticated" });
  }
  try {
    const tokenToDecode = token.split(" ")[1];
    const decoded = jwt.verify(tokenToDecode, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: "fail", message: "unauthorized" });
  }
}

module.exports = { accessResource };
