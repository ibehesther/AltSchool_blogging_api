const { check, query, oneOf, validationResult } = require("express-validator");
const Blog = require("../models/blog");
const User = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");

// Get all blog post
// Result filterable by state
// Paginate result
exports.getAllBlogPosts = async(req, res, next) => {
    let { limit=20, page=1, ...other_fields} = req.query;
    let { author } = other_fields;
    
    let blogAuthor = author && await User.findOne({first_name: {$regex: author, $options: "i"}});
    if(!blogAuthor) blogAuthor = author && await User.findOne({last_name: {$regex: author, $options: "i"}});
    if(blogAuthor) other_fields.author = blogAuthor._id;

    const blogs = new APIFeatures(Blog.find({}), { limit, page, ...other_fields})
                    .filter()
                    .sort()
                    .paginate()
    res.json(await blogs.query)

}

// Get all blog posts of a logged in user
// Result filterable by state
// Paginate result
exports.getUserBlogPosts = async( data, req, res, next) => {
    const { _id, type} = data;
    let { state="draft" } = req.query;
    try{
        if(type){
            return next(data);
        }
        const user = await User.findById(_id).populate("posts");
        if(user){
            const blogs = new APIFeatures(Blog.find({author: _id, state}), req.query)
                .filter()
                .sort()
                .paginate()
            res.json(await blogs.query)
            return
        }
        throw new Error();
    }catch(error){
        error.type = "not found";
        next(error);
    }
}

exports.getBlogPostById = async(req, res, next) => {
    const _id = req.params.id;
    try{
        let post = await Blog.findOne({_id}).populate("author", "first_name last_name");
        if(post){
            post.read_count += 1;
            post.save();
            res.json(post);
            return;
        }
        throw new Error();
    }catch(error){
        error.type = "not found";
        next(error);
    }
}

exports.createBlog = async( data, req, res, next) => {
    const { user, type, validInput } = data;

    try {
        if(!type) {
            let words = validInput.body.split(' ')
            let author = await User.findById(user._id);
            // Create reading time algorithm
            // Assuming a person reads 200 words in 60 secs
            let time_in_secs = (words.length * 60) / 200
            let reading_time = Math.ceil(time_in_secs);
    
            let post = await Blog.create({ ...validInput, author: user._id, reading_time });
            author.posts.push(post);
            author.save();
            res.status(201).json({post});
            return
        }else{
            next(data);
            return
        }
    }catch(error){
        error.type = "bad request";
        next(error);
    }
}

exports.updateBlog = async(data, req, res, next) => {
    const { user, validInput, type} = data
    const user_id = user._id
    const _id = req.params.id;
    try {
        // pass data to error handler middleware if it is an error
        if(type){
            next(data);
            return;
        }
        const post = await Blog.findById(_id)
        .populate('author');
        if(!post){
            let error = new Error();
            error.type = "not found";
            next(error);
            return;
        }
        const isBlogAuthorTheUser = post.author._id.equals(user_id);
        // only the author should be able edit the blog post
        if(isBlogAuthorTheUser){
            const updated_post = await Blog.updateOne({_id}, {
                $set: validInput
            });
            if(updated_post.modifiedCount){
                res.json({
                    message: "Blog post has been successfully updated!"
                });
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
}

exports.deleteBlog = async(data, req, res, next) => {
    const { type } = data;
    
    const _id = req.params.id;
    try {
        if(type){
            next(data);
            return;
        }
        const user_id = data._id
        const post = await Blog.findById(_id).populate('author');
        // only the author should be able delete the blog post
        const isBlogAuthorTheUser = post.author._id.equals(user_id);
        if(isBlogAuthorTheUser){
            post.delete();
            res.json({
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
}