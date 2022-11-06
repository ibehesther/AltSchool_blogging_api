const jwt = require("jsonwebtoken");
const User = require('../models/user');
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

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

const verify_jwt = (token, next) => {
    const token_duration_milliseconds = 3600000; //token valid for one hour
    const jwt_secret = process.env.JWT_SECRET_KEY;
    const verified = jwt.verify(token, jwt_secret);
    const current_time = Date.now();
    const expiry_date = new Date(verified.date).getTime() + token_duration_milliseconds;
    if(expiry_date >= current_time){
        return verified;
    }else{
        let err = new Error();
        err.type = "unauthorized";
        next(err);
    }
}

const jwt_auth = async(req, res, next) => {
    const header = req.headers;
    const token = get_token_from_header(header, next);
    try{
        if(token){
            const data = verify_jwt(token, next);
            if(data) {
                const { email, _id } = data;
                const user = await User.findOne({ email, _id });
                if(user){
                    req.user = user;
                    req.token = token;
                    next()
                }else{
                    let error = new Error();
                    error.type = "not found";
                    next(error);
                }
            }
        }
    }catch(error) {
        error.type = "unauthorized";
        next(error);
    }
}

module.exports = jwt_auth;