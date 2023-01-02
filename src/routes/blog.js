const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt_auth = require("../middlewares/auth");
const { getAllBlogPosts, getUserBlogPosts, getBlogPostById, createBlog, updateBlog, deleteBlog } = require("../controllers/blog");
const { validateCreateBlog, validateUpdateBlog } = require("../validators/blog.validator");

const blogRouter = express.Router();


// Get all blog posts
blogRouter.get("/", getAllBlogPosts)

// Get the blog posts of logged in user
blogRouter.get("/me", jwt_auth, getUserBlogPosts)

// Get a particular blog post
blogRouter.get("/:id", getBlogPostById)

// Create a blog post
blogRouter.post("/", [jwt_auth, validateCreateBlog], createBlog)

// Update a blog post
blogRouter.patch("/:id", [jwt_auth, validateUpdateBlog], updateBlog)

// Delete a blog post
blogRouter.delete("/:id", jwt_auth, deleteBlog)

module.exports= blogRouter;

