const express = require("express");
const { signup, signin } = require("../controllers/auth");
const { validateCreateUser } = require("../validators/user.validator");
require("dotenv").config();

const authRouter = express.Router();


authRouter.post("/signup", validateCreateUser, signup)

authRouter.post("/signin", signin)

module.exports = authRouter;