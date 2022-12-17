const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 15*60*100,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
})

module.exports = {
    limiter
}