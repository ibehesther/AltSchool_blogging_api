const User = require("../models/user");

exports.updateUser = async(data, req, res, next) => {
    const { user, validInput, type } = data;
    try{
        // Data contains a type field only when returning an error
        if(!type){
            Object.keys(validInput).forEach(el => {
                if(!validInput[el]) return delete validInput[el];
            })
            
            const updatedUser = await User.findByIdAndUpdate({_id: user._id}, {$set: validInput});
            if(updatedUser){
                res.json({message: "User updated successfully"})
                return;
            }
        }
        else{
            next(data);
        }
    }catch(err){
        next(err);
    }
}

exports.deleteUser = async(data, req, res, next) => {
    try{
        // Data contains a type field only when returning an error
        if(!data.type){
            const deletedUser = await User.findByIdAndDelete(data._id);
            if(deletedUser){
                res.json({message: "User deleted successfully"})
                return;
            }
        }
        else{
            next(data);
        }
    }catch(err){
        next(err);
    }
}