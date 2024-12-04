
const crypto = require("crypto");
const verifyWebhookSignature = (req, res, next) => {
    const signature = req.headers["x-webhook-signature"];
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if(!signature) {
        return res.status(401).json({ status: "fail", message: "No signature provided" });
    }

    const hmac = crypto.createHmac("sha256", webhookSecret);
    const calculatedSignature = hmac.update(JSON.stringify(req.body)).digest('hex');

    if(signature !== calculatedSignature) {
        return res.status(401).json({ status: "fail", message: "Invalid signature" });
    }

    next();

}

module.exports = { verifyWebhookSignature };