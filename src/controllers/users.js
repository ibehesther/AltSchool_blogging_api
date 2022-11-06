const User = require("../models/user");

exports.updateUser = async(req, res, next) => {
    const _id = req.user._id;
    const { first_name, last_name } = req.body;
    if(first_name || last_name){
        const user = await User.findByIdAndUpdate({_id}, 
           {$set: req.body});
        res.json({
            "success": true,
            "message": "User updated successfully"
        })
    }else{
        let error = new Error();
        error.type = "bad request"
        next(error);
    }
}

exports.deleteUser = async(req, res, next) => {
    const _id = req.user._id;
    const user = await User.findByIdAndDelete(_id);
    console.log(user)
    if(!user){
        let error = new Error();
        error.type = "not found"
        next(error);
        return;
    }
    res.json({
        "success": true,
        "message": "User deleted successfully"
    })
}