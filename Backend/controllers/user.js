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
// exports.update = async (req,res)=>{
//    try{
//         const userUpdated = await User.findByIdAndUpdate(
//             {_id:req.profile._id},
//             { $set: { name: req.body.name,email: req.body.email, hashed_password: req.body.password } },
//             {new:true})
//         if(!userUpdated){
//             return res.status(400).json({
//                 error : "you are not authorized to perform this action"
//             })
//         }
//         userUpdated.hashed_password = undefined
//         userUpdated.salt = undefined
//         res.status(200).json(userUpdated)
//    }
//    catch(err){
//     console.log(err)
//    }
// }


// chatgptt
exports.update = async (req, res) => {
    try {
      // Find the user by their ID
      let user = await User.findById(req.profile._id);
      
      // Check if user exists
      if (!user) {
        return res.status(400).json({
          error: "User not found"
        });
      }
  
      // Update the user's fields
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
  
      // Check if password is provided and update it
      if (req.body.password) {
        user.password = req.body.password; // This will trigger the virtual field's `set` function and hash the password
      }
  
      // Save the updated user
      const userUpdated = await user.save();
  
      // Remove sensitive fields from the response
      userUpdated.hashed_password = undefined;
      userUpdated.salt = undefined;
  
      // Send back the updated user data
      res.status(200).json(userUpdated);
  
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Could not update the user"
      });
    }
  };



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
        let totalAmount =  products.reduce((currentValue, nextValue) => {
                return currentValue + (nextValue.count || 0) * (nextValue.price || 0);
            }, 0);
            req.body.order.amount = totalAmount
            products.forEach((item) => {
                history.push({
                    _id : item._id,
                    name: item.name,
                    description: item.description,
                    category: item.category,
                    quantity: item.count,
                    amount : req.body.order.amount,
                    transaction_id: req.body.order.transaction_id || "server Transaction id static typedd",
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
        console.log("admin id",req.profile._id)
        const users = await 
        User.find({
            _id: { $ne: req.profile._id }
        })
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
        const role = parseInt(req.body.role)
        console.log(role)
        console.log(typeof role)
        let {id} = req.profileToUpdate
        const user = await User.findByIdAndUpdate(
            {_id:id},
            { $set: { name: req.body.name , role: role } },
            {new:true}
        )
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