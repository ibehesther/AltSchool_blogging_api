const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const { errorHandler } = require("./middlewares/error");


const PORT = process.env.PORT || 8080;
const app = express();


mongoose.connect('mongodb://localhost:27017/AltSchool_Blog')

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


// Middleware for error handling
app.use(errorHandler);
app.get("/", (req, res) => {
    res.send("Welcome to AltSchool Blogging API!")
})





app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})