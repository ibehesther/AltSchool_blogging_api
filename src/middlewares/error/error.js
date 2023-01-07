const errorHandler = (error, req, res, next) => {
  const message = error.e_message || error.details && error.details[0].message
  switch(error.type){
      case "bad request":
        res.status(400).json({
          error: "Bad Request",
          statusCode: 400,
          message: message || "Request cannot be fulfilled due to bad syntax"
        })
        break;
      case "unauthenticated":
        res.status(401).json({
          error: "Unauthenticated",
          statusCode: 401,
          message: message || "User is not authenticated"
        })
        break;
      case "unauthorized":
        res.status(403).json({
          error: "Unauthorized",
          statusCode: 403,
          message: message || "User is not authorized to access resource(s)"
        })
        break;
      case "not found":
        res.status(404).json({
          error: "Not Found",
          statusCode: 404,
          message: message || "Resource(s) not found"
        })
        break;
      default:
        res.status(500).json({
          error: "Internal Server Error",
          statusCode: 500,
          message: message || "Server could not process request"
        })
  next();
  }
}

module.exports = { errorHandler };