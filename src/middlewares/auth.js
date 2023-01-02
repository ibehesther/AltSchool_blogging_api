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

const jwt_auth = async(req, res, next) => {
    const header = req.headers;
    const token = get_token_from_header(header, next);
    try{
        if(token){
            const payload = jwt.verify(token, JWT_SECRET_KEY);
            const { _id, email } = payload;
            const user = await User.findOne({_id, email});
            if(!user){
                let error = new Error();
                error.type = "not found";
                next(error);
            }
            next(user);
        }else{
            let error = {};
            error.type = "unauthenticated"
            next(error)
        }
    }catch(error) {
        error.type = "unauthorized";
        next(error);
    }
}

module.exports = jwt_auth;