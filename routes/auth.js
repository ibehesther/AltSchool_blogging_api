const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user")
require("dotenv").config();

const authRouter = express.Router();


const generateJWT =(data) => {
    data.date = Date.now();
    const jwt_secret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(data, jwt_secret);
    return token;
}

authRouter.post("/signup", async(req, res, next) => {
    let { first_name, last_name, email, password } = req.body;
    
    try{
        if(first_name && last_name && email && password){
            const user = await User.create({ first_name, last_name, email, password });
            // Generate token
            const token = generateJWT({email, _id: user._id});
            res.status(201).json({user, token});
        }else{
            throw new Error();
        }
    }catch (err) {
        err.type = "bad request";
        next(err);
    }
})
authRouter.post("/login", async(req, res, next) => {
    let {email, password} = req.body;
    try {
        if(email && password){
            const hashedUser = await User.findOne({email});
            if(!hashedUser){
                let err = new Error();
                err.type = "not found";
                next(err);
                return;
            }
            // Compare users password to password in db
            password = await bcrypt.compare(password, hashedUser.password)
            if(!password) {
                let err = new Error();
                err.type = "unauthenticated";
                next(err);
                return;
            }
            // Validate user
            const user = await User.findOne({email, password: hashedUser.password});
            // Generate JWT
            const token = generateJWT({email, _id: user._id});
            res.send({
                user,
                token
            });
        }else{
            throw new Error();
        }
    }catch(error){
        error.type = "bad request";
        next(error);
    }
})

module.exports = authRouter;