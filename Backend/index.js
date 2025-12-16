const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require('cors');
const Message = require("./models/message") 


// import routes 
const authRoutes = require("./routes/auth") 
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require('./routes/product')
const braintreeRoutes = require("./routes/braintree")
const orderRoutes = require("./routes/order")
const chatRoutes = require("./routes/chat")

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
    console.log('Connected to DataBase Successfuly' )
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
// app.use('/api',chatRoutes);

app.get("/", async(req,res)=>{
    // res.send("hi welcome to  ecommerece store")
    // const msg = await Message.find()
    res.json({
      // messages:msg,
      test:"hi from my store (new changes received)"
    })
})

const port = process.env.PORT  || 8000;
// app.listen(port,()=>{ 
//     console.log(`server is running on ${port} port `)
// })




const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // allow frontend requests
});


// Initialize Socket.IO
const initSocket = require("./socket");
initSocket(io);







server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});