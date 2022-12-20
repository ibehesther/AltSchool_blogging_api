const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt_auth = require("../middlewares/auth")

const getOccurence = (array, object) => {
    let count = 0;
    array.map((val) => {val._id.equals(object._id) && count++});
    return count;
}

const getOrder = (order) => {
    order = order.toLowerCase();
    if (order == "desc"){
        return -1
    }
    else{
        return 1
    }
}


// exports.getAllBlogPosts = async(req, res, next) => {

// }


// Get all blog post
// Result filterable by state
// Paginate result
exports.getAllBlogPosts = async(req, res, next) => {
    
    let { limit=20, page=1, ...other_fields} = req.query;
    let { state, author, title } = other_fields;
    const fields_keys = Object.keys(other_fields);
    const filterable_fields = ["state", "title", "tags"];
    const orderable_fields = ["read_count", "reading_time", "createdAt"]
    limit = parseInt(limit);
    page = parseInt(page);
    startPage = (page - 1) * limit;
    endPage = startPage + limit;
    try{
        if(fields_keys.length){
            const filter_fields = fields_keys.filter((key) =>{
                for( field of filterable_fields){
                    if(field == key){
                        return field
                    }
                }
            })
            const order_fields = fields_keys.filter((key) =>{
                for( field of orderable_fields){
                    if(field == key){
                        return field
                    }
                }
            })
            // Make state query parameter case insensitive
            state = state && state.toLowerCase();
            if(state && state !== "draft" && state !== "published"){
                let error = new Error();
                error.type = "bad request";
                next(error);
                return;
            }
            let all_matching_results = [];
            
            if(filter_fields.length && order_fields.length){
                let filtered_result = []
                filtered_result = filter_fields.map(async(filter_field) => {
                    let ordered_result = order_fields.map(async(order_field) => {
                        // let all_matching_results = [];
                        let order = getOrder(other_fields[order_field]);
                        let posts = await Blog.find({[filter_field]: {$regex: other_fields[filter_field], $options: 'i'}})
                        .sort({[order_field]: order })
                        .populate("author", "first_name last_name")
                        .all()
                        all_matching_results.push(...posts);

                        // filter by author if available
                        if(author){
                            author = author.toLowerCase();
                            all_matching_results = all_matching_results.filter((result) => {
                                let { first_name, last_name } = result.author;
                                let author_name = `${first_name} ${last_name}`;
                                return author_name.toLowerCase().includes(author)
    
                            })
                        }
                        
                        let duplicate_result = all_matching_results.filter((field) => {
                            // get the number of times a result appears 
                            let count = getOccurence(all_matching_results, field);

                            // return if it appeared for each search term entered
                            if(count === filter_fields.length){
                                return field
                            }
                        })
        
                        // Remove all duplicates
                        const result = duplicate_result.slice(0, (duplicate_result.length/filter_fields.length));
                        return result
                    })
                    return await ordered_result[0]
                })
                let posts = await filtered_result[0];
                res.json(posts.slice(startPage, endPage));
            }
            else if(filter_fields.length && !order_fields.length){
                let filtered_result = []
                filtered_result = filter_fields.map(async(filter_field) => {
                    let posts = await Blog.find({[filter_field]: {$regex: other_fields[filter_field], $options: 'i'}})
                    .populate("author", "first_name last_name")
                    .all()
                    all_matching_results.push(...posts);

                    // filter by author if available
                    if(author){
                        author = author.toLowerCase();
                        all_matching_results = all_matching_results.filter((result) => {
                            let { first_name, last_name } = result.author;
                            let author_name = `${first_name} ${last_name}`;
                            return author_name.toLowerCase().includes(author)

                        })
                    }
                    
                    let duplicate_result = all_matching_results.filter((field) => {
                        // get the number of times a result appears 
                        let count = getOccurence(all_matching_results, field);

                        // return if it appeared for each search term entered
                        if(count === filter_fields.length){
                            return field
                        }
                    })
    
                    // Remove all duplicates
                    const result = duplicate_result.slice(0, (duplicate_result.length/filter_fields.length));
                    return result
                })
                let posts = await filtered_result[0];
                res.json(posts.slice(startPage, endPage));
            }
            else if(!filter_fields.length && order_fields.length){
                let ordered_result = order_fields.map(async(order_field) => {
                    let order = getOrder(other_fields[order_field]);
                    let posts = await Blog.find({})
                    .sort({[order_field]: order })
                    .populate("author", "first_name last_name")
                    .all()
                    all_matching_results.push(...posts);

                    // filter by author if available
                    if(author){
                        author = author.toLowerCase();
                        all_matching_results = all_matching_results.filter((result) => {
                            let { first_name, last_name } = result.author;
                            let author_name = `${first_name} ${last_name}`;
                            return author_name.toLowerCase().includes(author)

                        })
                    }

                    let duplicate_result = all_matching_results.filter((field) => {
                        // get the number of times a result appears 
                        let count = getOccurence(all_matching_results, field);

                        // return if it appeared for order term entered
                        if(count === order_fields.length){
                            return field
                        }
                    })
    
                    // Remove all duplicates
                    const result = duplicate_result.slice(0, (duplicate_result.length/filter_fields.length));
                    return result
                })
                let posts = await ordered_result[0];
                res.json(posts.slice(startPage, endPage));
            }
            else{
                let posts = await Blog.find({})
                .populate("author", "first_name last_name")
                .all()

                // filter by author if available
                if(author){
                    // case insensitive search
                    author = author.toLowerCase();
                    posts = posts.filter((result) => {
                        let { first_name, last_name } = result.author;
                        let author_name = `${first_name} ${last_name}`;
                        return author_name.toLowerCase().includes(author)

                    })
                }
                res.json(posts.slice(startPage, endPage));
            }
        }
        else{
            let posts = await Blog.find({})
            .populate("author", "first_name last_name")
            .all()
            .limit(limit).skip((page-1) * limit);
            res.json(posts);
        }
    }catch(error){
        error.type = "internal server error";
        next(error);
    }
}

// Get all blog posts of a logged in user
// Result filterable by state
// Paginate result
exports.getUserBlogPosts = async(req, res, next) => {
    const { _id } = req.user;
    let { limit=10, page=1, state } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    startPage = (page - 1) * limit;
    endPage = startPage + limit;
    try{
        const user = await User.findById(_id).populate("posts")
        if(user){
            if(state){
                // Make state query parameter case insensitive
                state = state.toLowerCase();
                if(state && state !== "draft" && state !== "published"){
                    let error = new Error();
                    error.type = "bad request";
                    next(error);
                    return;
                }
                let posts = await Blog.find({author: _id, state}).populate("author", "first_name last_name").all();
                res.json(posts);
                return;
            }else{
                let posts = await Blog.find({author: _id}).populate("author", "first_name last_name").all()
                .limit(limit).skip((page-1) * limit);
                res.json(posts);
                return
            }
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

exports.createBlog = async(req, res, next) => {
    let user = req.user;
    let { _id } = user;
    let { title, description, tags=[], body } = req.body;
    
    try {
        let words = body.split(' ')
        let author = await User.findById(user._id);

        // Create reading time algorithm
        // Assuming a person reads 200 words in 60 secs
        let time_in_secs = (words.length * 60) / 200
        let reading_time = Math.ceil(time_in_secs);

        let post = await Blog.create({ title, description, author: _id, reading_time, tags, body});
        author.posts.push(post);
        author.save();
        res.status(201).json({post});
    }catch(error){
        error.type = "bad request";
        next(error);
    }
}

exports.updateBlog = async(req, res, next) => {
    let user = req.user;
    const user_id = user._id
    const _id = req.params.id;
    const { state, description, read_count, reading_time, tags, body } = req.body
    try {
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
}

exports.deleteBlog = async(req, res, next) => {
    let user = req.user;
    const user_id = user._id;
    const _id = req.params.id;
    try {
        const post = await Blog.findById(_id).populate('author');
        // only the author should be able delete the blog post
        const isBlogAuthorTheUser = post.author._id.equals(user_id);
        if(isBlogAuthorTheUser){
            post.delete();
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
}