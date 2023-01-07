const express = require("express");
const jwt_auth = require("../middlewares/auth/auth");
const { getAllBlogPosts, getUserBlogPosts, getBlogPostById, createBlog, updateBlog, deleteBlog } = require("../controllers/blog");
const { validateCreateBlog, validateUpdateBlog } = require("../middlewares/validators/blog");

const blogRouter = express.Router();


// Get all blog posts
blogRouter.get("/", getAllBlogPosts)

// Protected route
// Get the blog posts of logged in user
blogRouter.get("/me", jwt_auth, getUserBlogPosts)

// Get a particular blog post
blogRouter.get("/:id", getBlogPostById)

// Protected route
// Create a blog post
blogRouter.post("/", [jwt_auth, validateCreateBlog], createBlog)

// Protected route
// Update a blog post
blogRouter.patch("/:id", [jwt_auth, validateUpdateBlog], updateBlog)

// Protected route
// Delete a blog post
blogRouter.delete("/:id", jwt_auth, deleteBlog)

module.exports= blogRouter;

