const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt_auth = require("../middlewares/auth")

const blogRouter = express.Router();


// Get all blog post
blogRouter.get("/", async(req, res, next) => {
    try{
        const blogPosts = await Blog.find({}).all();
        res.json(blogPosts);
    }catch(error){
        error.type = "internal server error";
        next(error);
    }
})
// create a blog post
blogRouter.post("/", jwt_auth, async(req, res, next) => {
    let user = req.user;
    let { title, description, read_count, reading_time, tags, body } = req.body;
    try {
        let blog = await Blog.create({ title, description, author: user._id, read_count, reading_time, tags, body});
        res.status(201).json({blog});
    }catch(error){
        error.type = "bad request";
        next(error);
    }
})


module.exports= blogRouter;

