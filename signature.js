
const crypto = require('crypto');

exports.prepSignature = (secret, method, path, timestamp, payload = "") => {
    return crypto.createHmac('sha256', secret).update(timestamp + method + path + payload).digest('hex');
}