const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { limiter } = require("./config/config")
const authRouter = require("./routes/auth");
const { errorHandler } = require("./middlewares/error");
const jwt_auth = require("./middlewares/auth");
const userRouter = require("./routes/users");
const blogRouter = require("./routes/blog");
const { logger } = require("./services/log")
require("dotenv").config()


const PORT = process.env.PORT || 8080;
const app = express();
const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
 

mongoose.connect(`mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@bareskn-api.o25gix8.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`)

mongoose.connection.on("connected", () => {
	logger.info("Connected to MongoDB Successfully");
});

mongoose.connection.on("error", (err) => {
	logger.error("An error occurred while connecting to MongoDB");
	logger.error(err);
});

app.use(cors({origin: '*'}))
app.use(express.json())
app.use(limiter)

// Connect express application to express routers
app.use("/api/v1.0", authRouter);
app.use("/api/v1.0/users", userRouter);
app.use("/api/v1.0/blogs", blogRouter);


// Middleware for error handling
app.use(errorHandler);
app.get("/api/v1.0", (req, res) => {
    res.send("Welcome to AltSchool Blogging API Version 1.0!")
})





app.listen(PORT , () => {
    logger.info(`Server is running on port ${PORT}`)
})