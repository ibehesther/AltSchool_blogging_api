const express = require("express");
const { updateUser, deleteUser } = require("../controllers/user");
const jwt_auth = require("../middlewares/auth/auth");
const { validateUpdateUser } = require("../middlewares/validators/user");

const userRouter = express.Router();

// Update user's details
userRouter.patch('/', [jwt_auth, validateUpdateUser], updateUser)

// Delete user's details
userRouter.delete('/', jwt_auth, deleteUser)

module.exports = userRouter;