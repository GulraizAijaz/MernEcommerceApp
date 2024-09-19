const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require('cors');
// import routes 

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require('./routes/product')
const braintreeRoutes = require("./routes/braintree")
const orderRoutes = require("./routes/order")

// app
const app = express();
app.use(express.json());
app.use(cors()); // Enable all CORS requests
// middlewares


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());



// Database
mongoose.connect(process.env.DATABASE).then(()=> {
    console.log('DataBase Is Connected Mongo' )
})
.catch(err=>{
    console.log(err)
})



// routes 
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',braintreeRoutes);
app.use('/api',orderRoutes);

app.get("/",(req,res)=>{
    res.send("hi welcome to the ecommerece glz store")
})



const port = process.env.PORT  || 8000;
app.listen(port,()=>{
    console.log("server is runnnning on this port"+ port)
})