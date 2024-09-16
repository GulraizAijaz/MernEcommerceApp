const User = require("../models/user");
const braintree = require("braintree")
require('dotenv').config
    
const gateway = new braintree.BraintreeGateway({
    environment:  braintree.Environment.Sandbox,
    merchantId:   process.env.BRAINTREE_MERCHANT_ID,
    publicKey:    process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:   process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = (req,res)=>{
try{
    gateway.clientToken.generate({},function(error,response){
        if(error){
            res.status(500).send(error)
        }
        else{
            res.send(response)
        }
    })
}
catch(err){
    console.log(err)
}
}
exports.processPayment = (req,res)=>{
try{
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount
    // charge
    let newTransaction = gateway.transaction.sale({
        amount : amountFromTheClient,
        paymentMethodNonce : nonceFromTheClient,
        options : {
            submitForSettlement : true
        }
    },(error,result)=>{
        if(error){
            res.status(500).json({error})
        }
        else{
            res.json({result})
        }
    })
}
catch(err){
    console.log(err)
}
}