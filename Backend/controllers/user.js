const User = require("../models/user")
const {Order} = require('../models/order')




exports.userById = async (req, res,next,id) => {
    try{
        const user = await User.findById(id);
        if(!user){
            return res.status(400).json({error:"user not found"})
        }
            req.profile = user;
            next();
    }
    catch(error){
        console.log(error)
    }
    
};
exports.adminUserbyId = async (req, res,next,id)=>{
    try{
        const user = await User.findById(id);
        if(!user){
        return res.status(400).json({error:"user not found"})
        }
        req.profileToUpdate = user;
        next();
    }
    catch(err){
        console.log(err)
    }
}

exports.read = (req,res)=>{
    try{
        req.profile.hashed_password = undefined
        req.profile.salt = undefined
        return res.json(req.profile)
    }
    catch(err){
        console.log(err)
    }

}
exports.update = async (req,res)=>{
   try{
        const userUpdated = await User.findByIdAndUpdate({_id:req.profile._id},{$set:req.body},{new:true})
        if(!userUpdated){
            return res.status(400).json({
                error : "you are not authorized to perform this action"
            })
        }
        userUpdated.hashed_password = undefined
        userUpdated.salt = undefined
        res.status(200).json(userUpdated)
   }
   catch(err){
    console.log(err)
   }
}



exports.remove = async(req,res)=>{
    try{
        let userId = req.profile.id
        const userRemoved = await User.findByIdAndDelete(userId);
        if(!userRemoved){
        return res.status(400).json({
            error : " cannot delete this account or you are not auth"
        })
        }
        res.status(200).json({
        msg: "user is deleted seccessfully",
        user: userRemoved
        })
    }
    catch(err){
        console.log(err)
    }
}
// orders history add middlewares
exports.addOrderToUserHistory = async(req,res,next)=>{
    try{
        let history = []
            req.body.order.products.forEach((item) => {
                history.push({
                    _id : item._id,
                    name: item.name,
                    description: item.description,
                    category: item.category,
                    quantity: item.count,
                    transaction_id: req.body.order.transaction_id,
                    amount: req.body.order.amount
                })
            });

            let updatedHistory = await User.findOneAndUpdate(
                {_id:req.profile._id},
                {$push:{history:history}},
                {new:true}
            )
            if(!updatedHistory){
                return res.status(400).json({
                    error:"cannot update user history"
                })
            }
            next()
    }
    catch(err){
        console.log(err)
    }
}
exports.addOrderToUserHistoryCod = async(req,res,next)=>{
    try{
        let history = []
        let products = req.body.order.products
        const totalAmount =  products.reduce((currentValue, nextValue) => {
                return currentValue + (nextValue.count || 0) * (nextValue.price || 0);
            }, 0);
        
        console.log(totalAmount)
            products.forEach((item) => {
                history.push({
                    _id : item._id,
                    name: item.name,
                    description: item.description,
                    category: item.category,
                    quantity: item.count,
                    transaction_id: req.body.order.transaction_id || "server Transaction id static typedd",
                    amount: totalAmount
                })
            });

            let updatedHistory = await User.findOneAndUpdate(
                {_id:req.profile._id},
                {$push:{history:history}},
                {new:true}
            )
            if(!updatedHistory){
                return res.status(400).json({
                    error:"cannot update user history"
                })
            }
            next()
    }
    catch(err){
        console.log(err)
    }
}

exports.purchaseHistory = async(req,res)=>{
    try{
    const orders = await 
    Order.find({user:req.profile._id})
    .populate("user","_id name")
    .sort("-created")
    .exec()

    if(!orders){
        return res.status(400).json({
            error:"Cannot Find Orders server error"
        })
    }
    return res.status(200).json(orders)
    }
    catch(error){
        console.log(error)
    }

}
exports.allUsers = async(req,res)=>{
    try{
        const users = await 
        User.find()
        .select("_id name email role phone dob createdAt updatedAt")
        .exec()

        if(!users){
            return res.status(400).json({
                error : "no users available"
            })
        }
        return res.status(200).json(users)
    }
    catch(err){
        console.log(err)
    }
}

exports.userReadForAdmin = async(req,res)=>{
    try{
        let {id} = req.profileToUpdate

        const user = await User.findById(id)
        .select("name role")
        .exec()
        if(!user){
            return res.status(400).json({
                error: " user not found"
            })
        }
        return res.status(200).json(user)
    }
    catch(error){
        console.log(error)
    }
   
}

exports.updateByAdmin = async(req,res)=>{
    try{
        let {id} = req.profileToUpdate
        console.log(req.body)
        const user = await User.findByIdAndUpdate({_id:id},{$set:req.body},{new:true})
        if(!user){
            return res.status(400).json({
                error : "cannot find or update user"
            })
        }
        const userUpdated = await User.findById(id)
        .select("name role")
        .exec()

            return res.status(200).json({
                message:"User Updated Successfully",
                userUpdated
            })
    }
    catch(error){
        console.log(error)
    }
    
}
exports.userDeleteByAdmin = async (req,res)=>{
    try{
        let {id} = req.profileToUpdate

        const user = await User.findByIdAndDelete(id)
        if(!user){
            return res.status(400).json({
                error: "user not delete because not found"
            })
        }
        return res.status(200).json({
            meesage:"user deleted succesfully",
            user
        })
    }
    catch(error){
        console.log(error)
    }
}