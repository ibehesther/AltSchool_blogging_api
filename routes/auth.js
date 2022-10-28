const express = require("express");
const passport = require("passport");
require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", passport.authenticate("signup", {session: false}), (req, res) => {
    console.log(req.user)
})
authRouter.post("/login", passport.authenticate("login", {session: false}), (req, res) => {
    console.log(req.user)
})

module.exports = authRouter;