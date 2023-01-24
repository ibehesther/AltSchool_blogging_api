const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const { errorHandler } = require("./middlewares/error/error");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { logger } = require("./services/logger");
const { limiter } = require("./services/limiter");
const { httpLogger } = require("./services/httpLogger");
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

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(limiter);
app.use(httpLogger);

// Connect express application to express routers
app.use("/api/v1.0", authRouter);
app.use("/api/v1.0/users", userRouter);
app.use("/api/v1.0/blogs", blogRouter);


app.get("/api/v1.0", (req, res) => {
    res.send("Welcome to AltSchool Blogging API Version 1.0!")
})

app.get("/", (req, res) => {
	res.redirect("/api/v1.0");
})

app.get("*", (req, res, next) => {
	const err = new Error();
	err.type = "not found";
	next(err);
})

// Middleware for error handling
app.use(errorHandler);



app.listen(PORT , () => {
    logger.info(`Server is running on port ${PORT}`)
})