const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt_auth = require("../middlewares/auth")

const blogRouter = express.Router();


// Get all blog post
blogRouter.get("/", async(req, res, next) => {
    try{
        const posts = await Blog.find({}).all().populate("author");
        res.json(posts);
    }catch(error){
        error.type = "internal server error";
        next(error);
    }
})

// Get all blog posts of a logged in user
blogRouter.get("/me", jwt_auth, async(req, res, next) => {
    const { _id } = req.user;
    try{
        const user = await User.findById(_id).populate("posts");
        if(user){
            res.json(user.posts);
            return;
        }
        throw new Error();
    }catch(error){
        error.type = "not found";
        next(error);
    }
})

// Get a particular blog post
blogRouter.get("/:id", async(req, res, next) => {
    const _id = req.params.id;
    try{
        const post = await Blog.findOne({_id}).populate("author");
        if(post){
            res.json(post);
            return;
        }
        throw new Error();
    }catch(error){
        error.type = "not found";
        next(error);
    }
})

// Create a blog post
blogRouter.post("/", jwt_auth, async(req, res, next) => {
    let user = req.user;
    let { title, description, read_count, reading_time, tags, body } = req.body;
    try {
        let author = await User.findById(user._id);
        let post = await Blog.create({ title, description, author: user._id, read_count, reading_time, tags, body});
        author.posts.push(post);
        author.save();
        res.status(201).json({post});
    }catch(error){
        error.type = "bad request";
        next(error);
    }
})

// Update a blog post
blogRouter.patch("/:id", jwt_auth, async(req, res, next) => {
    let user = req.user;
    const user_id = user._id;
    const _id = req.params.id;
    const { state, description, read_count, reading_time, tags, body } = req.body
    try {
        const post = await Blog.findById(_id).populate('author');
        if(!post){
            let error = new Error();
            error.type = "not found";
            next(error);
            return;
        }
        const isBlogAuthorTheUser = post.author._id.equals(user_id);
        // only the author should be able edit the blog post
        if(isBlogAuthorTheUser){
           if(state || description || read_count || reading_time || tags || body){
                const updated_post = await Blog.updateOne({_id}, {
                    $set: req.body
                });
                if(updated_post.modifiedCount){
                    res.json({
                        success: true,
                        message: "Blog post has been successfully updated!"
                    });
                }
           }
        }
        else{
            let error = new Error();
            error.type = "unauthorized";
            next(error);
        }
    }catch(error){
        error.type = "bad request";
        next(error);
    }
})

// Delete a blog post
blogRouter.delete("/:id", jwt_auth, async(req, res, next) => {
    let user = req.user;
    const user_id = user._id;
    const _id = req.params.id;
    try {
        const blogPost = await Blog.findById(_id).populate('author');
        const author_id = blogPost.author._id;
        // only the author should be able delete the blog post
        if(user_id === author_id){
            blogPost.delete();
            res.json({
                success: true,
                message: "Blog post has been successfuly deleted!"
            })
        }
        else{
            let error = new Error();
            error.type = "unauthorized";
            next(error);
        }
    }catch(error){
        error.type = "bad request";
        next(error);
    }
})

module.exports= blogRouter;

