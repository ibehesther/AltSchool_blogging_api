const winston = require("winston");

const options = {
    file: {
        level: "info",
        filename: "./src/logs/app.log",
        handleException: true,
        json: true,
        maxSize: 5242850,
        maxFile: 5,
        colorize: false
    },
    console: {
        level: "debug",
        handleException: true,
        json: false,
        colorize: true
    }
}

const logger = winston.createLogger({
    level: winston.config.npm.levels,
    format: winston.format.json(),
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
})
  

module.exports = { logger }