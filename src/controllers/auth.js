
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();

const {JWT_SECRET_KEY} = process.env

const generateJWT =({_id, email}) => {
    const payload = {
        _id,
        email
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}

exports.signup = async(data, req, res, next) => {
    try{
        if(!data.type){
            const user = await User.create({...data});
            // Generate token
            const token = generateJWT({email: user.email, _id: user._id});
            res.status(201).json({user, token});
            return
        }else{
            next(data);
        }
    }catch (err) {
        err.type = "bad request";
        next(err);
    }
}

exports.signin = async(req, res, next) => {
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
}