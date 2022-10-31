const express = require("express");
const User = require("../models/user");

const userRouter = express.Router();

// Update user's details
userRouter.patch('/', async(req, res, next) => {
    const _id = req.user._id;
    const { first_name, last_name } = req.body;
    if(first_name || last_name){
        const user = await User.findByIdAndUpdate({_id}, 
           {$set: req.body});
        console.log(user)
        res.json({
            "success": true,
            "message": "User updated successfully"
        })
    }else{
        let error = new Error();
        error.type = "bad request"
        next(error);
    }
})

// Delete user's details
userRouter.delete('/', async(req, res, next) => {
    const _id = req.user._id;
    const user = await User.findByIdAndDelete(_id);
    console.log(user)
    res.json({
        "success": true,
        "message": "User deleted successfully"
    })
})

module.exports = userRouter;