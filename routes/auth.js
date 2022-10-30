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
    console.log(token)
    return token;
}

const get_token_from_header =(header, next) => {
    if("authorization" in header){
        const header_parts = header['authorization'].split(' ');
        if(header_parts.length === 2){
            if(header_parts[0] === "Bearer"){
                return header_parts[1]
            }else{
                let err = new Error();
                err.type = "bad request";
                next(err);
            }
        }else{
            let err = new Error();
            err.type = "bad request";
            next(err);
        }
    }else{
        let err = new Error();
        err.type = "unauthenticated";
        next(err);
    }
}

authRouter.post("/signup", async(req, res, next) => {
    let { first_name, last_name, email, password } = req.body;
    
    try{
        if(first_name && last_name && email && password){
            // Hash password
            // password = await bcrypt.hash(password, SALT_ROUNDS);
            // Generate token
            const token = generateJWT({email, password});
            console.log(token)
            const user = await User.create({ first_name, last_name, email, password });
            console.log(token)
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
    console.log(email, password)
    try {
        if(email && password){
            const hashedUser = await User.findOne({email});
            if(!hashedUser){
                throw new Error();
            }
            // Compare users password to password in db
            password = await bcrypt.compare(password, hashedUser.password)
            if(!password) {
                let err = new Error();
                err.type = "unauthenticated";
                next(err);
            }
            // Validate user
            const user = await User.findOne({email, password: hashedUser.password});
            // Generate JWT
            const token = generateJWT({email, password: user.password});
            res.send({
                user,
                token
            });
        }else{
            throw new Error();
        }
    }catch(error){
        error.type = "not found";
        next(error);
    }
})

module.exports = authRouter;