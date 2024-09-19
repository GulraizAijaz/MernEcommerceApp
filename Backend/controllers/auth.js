const User = require("../models/user");
// to generate signed token
const jwt = require('jsonwebtoken');  
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const {expressjwt: expressJwt} = require("express-jwt");
// for authorization check
const {errorHandler} = require('../helpers/dbErrorHandler');
// sign up 

exports.signUp = async (req,res)=>{    
try{
    const {name,email,password} = req.body
    if(!email || !name || !password){
        return res.status(400).json({
            error: " please fill all fields"
        })
    }
    const userExist = await User.findOne({ email: email })
    if(userExist){
        return res.status(400).json({
            error: "Email already exists, please try another email."
        });
    }
    const user = await new User(req.body);
    await user.save();
    if(!user){
        return res.status(400).json({error: "Cannot create user try again later"})
    }
    return res.status(200).json({
        message:"user created successfully",
        user
    });
}
catch(error){
    console.log(error)
}
          
}
 
// sign in

exports.signIn = async (req,res)=>{
try{
    // find the user based on email
    const {email,password} = req.body;
    const userExist = await User.findOne({email:email})
    if(!userExist){
        return res.status(400).json({
                    err:"user with that email doesn't exists.please try sign up"
                })
    }
    else{
        // if user exists, make sure email and pass matches
            //  create authenticate method in user model
            if(!userExist.authenticate(password)){
                return res.status(401).json({
                    err: 'email and pass dont match'
                })
            }
        
            // generate a signed token with user id and secret
        
            const token = jwt.sign({_id:userExist.id},process.env.JWT_SECRET,  { algorithm: 'HS256', expiresIn: '1d' })
            // persist the token as t in cookie with expiry date
            res.cookie('t',token
                ,{expire: new Date()+99999}
            )
            // return res with user and token to frontend client
            const {_id, name , email , role,phone,address}= userExist;
             res.json({
                token,
                user:{_id,email,name,role,phone,address}
            })
    }
}
catch(err){
    console.log(err)
}
            
};

exports.signOut= (req,res)=>{
try{
    res.clearCookie('t')
    res.json({
        message: "signout successful"
    })
}
catch(err){
    console.log(err)
}
};

// sign out


exports.requireSignIn = expressJwt({
    secret : process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty : "auth"
})
    
exports.isAuth = (req,res,next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({
            error:"You are Not Authorized"
        })
    }
    next()
}

exports.isAdmin = (req,res,next)=>{
    let role = req.profile.role;

    if(role === 0){
        return res.status(403).json({
            error:"Admin route! Only"
        })  
    }
    next()
}














