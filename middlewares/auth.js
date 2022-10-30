const passport = require("passport");
const jwt = require("jsonwebtoken");
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userModel = require('../models/user');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;

// middleware to check and validate bearer token in the authorization header
passport.use(
    new JwtStrategy(
        opts, 
        function(token, done) {
            userModel.findOne({username: token.username}, function(err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            });
        }
    )
);

// Middleware for signup
passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        async (req,email, password, done) =>{
            try{
                let { email, password, first_name, last_name,  } = req.body;
                const user = await userModel.create({email, password, first_name, last_name});
                const token = jwt.sign({ email, _id: user._id }, JWT_SECRET);
                return done(null, { user, token })
            }catch(error){
                let err = new Error()
                err.type = "internal server error"
                return done(err);
            }
        }
    )
);

// Middleware for signup
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        async (req,email, password, done) =>{
            try{
                const user = await userModel.findOne({email});
                if(!user){
                    let err = new Error()
                    err.type = "not found"
                    return done(err);
                }
                const validPassword = await user.validPassword(password);
                if(!validPassword){
                    let err = new Error()
                    err.type = "unauthenticated"
                    return done(err);
                }
                const token = jwt.sign({email, _id: user._id}, JWT_SECRET);
                return done(null, {user, token})
            }catch(error){
                done(error)
            }
        }
    )
);