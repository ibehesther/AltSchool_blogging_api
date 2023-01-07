const rateLimit = require("express-rate-limit")

exports.limiter = rateLimit({
    windowMs: 15*60*100,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
})
