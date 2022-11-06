const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const { errorHandler } = require("./middlewares/error");
const jwt_auth = require("./middlewares/auth");
const userRouter = require("./routes/users");
const blogRouter = require("./routes/blog");
require("dotenv").config()


const PORT = process.env.PORT || 8080;
const app = express();
const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
 

mongoose.connect(`mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@bareskn-api.o25gix8.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`)

mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB Successfully");
});

mongoose.connection.on("error", (err) => {
	console.log("An error occurred while connecting to MongoDB");
	console.log(err);
});

app.use(cors({origin: '*'}))
app.use(express.json())

// Connect express application to express routers
app.use("/", authRouter);
app.use("/users", jwt_auth, userRouter);
app.use("/blogs", blogRouter);


// Middleware for error handling
app.use(errorHandler);
app.get("/", (req, res) => {
    res.send("Welcome to AltSchool Blogging API!")
})





app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})