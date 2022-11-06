const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userRouter = require("../routes/users");
const blogRouter = require("../routes/blog");
const authRouter = require("../routes/auth");
const jwt_auth = require("../middlewares/auth");
const { errorHandler } = require("../middlewares/error");


const app = express();

const PORT = 3334;

app.use(cors({origin: '*'}))
app.use(express.json());



mongoose.connect('mongodb://localhost:27017/alts_blog_test')

mongoose.connection.on("connected", () => {
	console.log("Connected to Test MongoDB Successfully");
});

mongoose.connection.on("error", (err) => {
	console.log("An error occurred while connecting to MongoDB");
	console.log(err);
});

// Connect test express application to express routers
app.use("/", authRouter)
app.use("/users",jwt_auth, userRouter)
app.use("/blogs", blogRouter)



// Middleware for error handling
app.use(errorHandler);
app.get("/", (req, res) => {
    res.send("Welcome to AltSchool Blogging API!")
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = app