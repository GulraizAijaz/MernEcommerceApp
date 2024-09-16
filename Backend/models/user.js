const mongoose = require("mongoose");
const crypto = require("crypto"); 
const uuid = require("uuid")
const bcrypt = require('bcryptjs')
// const { type } = require("os");
// const { kMaxLength } = require("buffer");


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: 32
    },
    hashed_password:{
        type: String,
        required: true,
    },
    about:{
        type: String,
        trim: true,
    },
    salt: String,
    role:{
        type: Number,
        default: 0,
    },
    history:{
        type: Array,
        default: [],
    },
    dob:{
      type: Date,
      required:false
    },
    phone:{
      type:Number,
      required:false
    }
},{
    timestamps:true,
})

userSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.hashed_password = bcrypt.hashSync(password, 10); // Hash password with 10 salt rounds
  })
  .get(function() {
    return this._password;
  });

// Methods for the user schema
userSchema.methods = {
  authenticate: function(plainText) {
    return bcrypt.compareSync(plainText, this.hashed_password); // Compare plain text with hashed password
  }
};


// virtual fields

// userSchema.virtual('password')
// .set(function(password){
//     this._password = password;
//     this.salt = uuid.v1();
//     this.hashed_password = this.encryptPassword(password)
// })
// .get(function(){
//     return this.password
// });

// userSchema.methods = {
//         authenticate: function(plainText){
//         return this.encryptPassword(plainText) === this.hashed_password;
//         },
//         encryptPassword : function(password){
//             if(!password) return "";
//             try{
//                 return crypto.createHmac("sha1",this.salt)
//                         .update(password)
//                         .digest("hex")
//             }
//             catch(err){
//                 return "";
//             }
//         }
// }

module.exports = mongoose.model("User",userSchema);