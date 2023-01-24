const morgan = require("morgan");
const json = require("morgan-json");
const { logger } = require("./logger");

const format = json({
    method: ":method",
    url: ":url",
    status: ":status",
    contentLength: ":res[contentLength]",
    responseTime: ":response-time"
})

exports.httpLogger = morgan(format, {
    stream: {
        write: (message) => {
            const {
                method, url, status, contentLength, responseTime
            } = JSON.parse(message);
            logger.info("HTTP Access log", {
                timestamp: newDate().toString(),
                method,
                url,
                status: Number(status),
                contentLength,
                responseTime: Number(responseTime)
            })
        }
    }
})