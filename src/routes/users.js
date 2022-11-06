const express = require("express");
const { updateUser, deleteUser } = require("../controllers/users");

const userRouter = express.Router();

// Update user's details
userRouter.patch('/', updateUser)

// Delete user's details
userRouter.delete('/', deleteUser)

module.exports = userRouter;