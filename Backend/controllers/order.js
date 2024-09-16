const {Order,CartItem} = require('../models/order')
const {errorHandler}= require('../helpers/dbErrorHandler')


exports.orderById = async(req,res,next,id)=>{
try{
        let order = await Order.findById(id)
        .populate("products.product","name price")
        .exec()

        if(!order){
            return res.status(400).json({
                error: "cant find product"
            })
        }
        req.order = order
        console.log(req.order._id)
        next()
}
catch(err){
        console.log(err)
}
}
exports.addTransactionIdToCod = (req,res,next)=>{
     // making random string for transaction id
     const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     let transactionId = "";
     for ( let i = 0; i < 15; i++ ) {
         transactionId += characters.charAt(Math.floor(Math.random() * 9));
     }
    req.body.order.transaction_id = transactionId
    req.body.order.orderType = "Cash On Delivery"
    next()
    
}

exports.create = async(req,res)=>{
    try{
        req.profile.hashed_password = undefined
        req.body.order.user = req.profile
        console.log(req.body.order.orderType)
        const order = await new Order(req.body.order)
        const orderCreated = await order.save()
        if(!orderCreated){
            return res.status(400).json({
                error : "error cannot create order"
            })
        }
        res.status(200).json({
                        order: orderCreated,
                        msg: "order created"
                    })
    }
    catch(err){
        console.log(err)
    }
}

exports.listOrders = async(req,res)=>{
try{
    let orderList = await Order.find()
    .populate("user","_id name address")
    .sort("-created")
    .exec()
    if(!orderList){
        return res.status(400).json({
            error:"cannot found order server error"
        })
    }
    res.status(200).json(orderList)
}
catch(err){
    console.log(err)
}
    
}
exports.getStatusValues = async(req,res)=>{
    res.json(Order.schema.path('status').enumValues)
}
exports.updateOrderStatus = async(req,res)=>{
try {
    let statusUpdated = await Order.findByIdAndUpdate(
        req.order._id, 
        { $set: { status: req.body.status } },
        { new: true } // This option returns the updated document
    );

    if (!statusUpdated) {
        return res.status(400).json({
            error: "cannot update,Try again later"
        });
    }

    res.json(statusUpdated); // Return the updated order
}
catch (err) {
    return res.status(500).json({
        error: "Server error: " + err.message
    });
}
}