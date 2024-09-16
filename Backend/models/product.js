const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 32
    },
    description:{
        type: String,
        trim: true,
        required: true,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    category:{
        type: ObjectId,
        ref: 'Category',
        required: true,
    },
    quantity:{
        type:Number,
    },
    sold:{
        type : Number,
        default : 0,
    },
    shipping:{
        required:false,
        type:Boolean,
        
    }
   
},{
    timestamps:true,
})


module.exports = mongoose.model("Product",productSchema);