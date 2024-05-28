const jwt = require("jsonwebtoken");
async function accessResource(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).send({ status: "fail", message: "unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ status: "fail", message: "unauthorized" });
    }
}

module.exports = { accessResource }