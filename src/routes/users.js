const express = require("express");
const { updateUser, deleteUser } = require("../controllers/users");
const jwt_auth = require("../middlewares/auth");
const { validateUpdateUser } = require("../validators/user.validator");

const userRouter = express.Router();

// Update user's details
userRouter.patch('/', [jwt_auth, validateUpdateUser], updateUser)

// Delete user's details
userRouter.delete('/', jwt_auth, deleteUser)

module.exports = userRouter;