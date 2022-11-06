const errorHandler = (error, req, res, next) => {
    switch(error.type){
        case "bad request":
          res.status(400).json({
            error: "Bad Request",
            statusCode: 400,
            message: "Request cannot be fulfilled due to bad syntax"
          })
          break;
        case "unauthenticated":
          res.status(401).json({
            error: "Unauthenticated",
            statusCode: 401,
            message: "User is not authenticated"
          })
          break;
        case "unauthorized":
          res.status(403).json({
            error: "Unauthorized",
            statusCode: 403,
            message: "User is not authorized to access resource(s)"
          })
          break;
        case "not found":
          // res.status(404).json({
          //   error: "Not Found",
          //   statusCode: 404,
          //   message: "Resource not found"
          // })
          res.status(404).send("not found")
          break;  
        case "internal server error":
          res.status(500).json({
            error: "Internal Server Error",
            statusCode: 500,
            message: "Server could not process request"
          })
          break;
        default:
          console.log("Error not handled");
    }
    next();
}

module.exports = { errorHandler };