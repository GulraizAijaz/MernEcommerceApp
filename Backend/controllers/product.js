const Product = require("../models/product")
const Category = require('../models/category')

exports.productById = async (req,res,next,id)=>{
  try{
    const product = await Product.findById(id)
    .populate('category')
    .exec();
    if(!product){
      return res.status(400).json({
        err:"product not found "
      })
    }
    req.product = product
    next()
  }
  catch(err){
    console.log(err)
  }
 
}

exports.read = (req,res)=>{
  try{
    req.product.photo = undefined
    const product = req.product
    if(!product){
      res.json({
        error:'no product found'
      })
    }
    return res.json({product})
  }
  catch(err){
    console.log(err)
  }
}
// create
exports.create = async (req, res) => {
    
try {
    const { name, description, price,categoryId,quantity,shipping,} = req.body;
    if(!name, !description, !price,!categoryId,!quantity,!shipping){
        return res.status(400).json({
          error : "All fields are required"
        })
    }

    const photoSize = req.file.size;
    //  1mb = 1000000bytes
    // 1kb = 1000bytes
    if(photoSize>1000000){
      return res.status(400).json({
        error: "image is expected to be less than or equal to 1Mb"
      })
    }
    // Check if category exists or not
    let category = await Category.findOne({_id: categoryId });
    if(!category){
      return res.status(400).json({
        error: "Category does not exist"
      })
    }
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      photo: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      quantity,
      shipping :shipping == 'yes'? true : false
    });
    
    await newProduct.save();
    res.status(200).json({
      success:"true",
      newProduct
    });
  } 
  catch (error) {
    console.log(error)
}
}
// delete
exports.remove = async(req,res)=>{
  try{
      let productId = req.product.id
      const productremoved = await Product.findByIdAndDelete(productId);
      if(!productremoved){
        return res.status(400).json({
          error : " cannot delete this product or product not found"
        })
      }
      res.status(200).json({
        msg: "product is deleted seccessfully",
        product: productremoved
      })
  }
  catch(err){
    console.log(err)
  }
}


// update
exports.update = async(req,res)=>{
  try{
      const updatedProduct = {...req.body}
      if (req.file) {
        updatedProduct.photo = {
          data: req.file.buffer,
          contentType: req.file.mimetype
        };
      }
      const product = await Product.findByIdAndUpdate(req.product._id, updatedProduct, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully', product });
  }
  catch(err){
    console.log(err)
  }
}



// products by queries
// sell // arrival
// By Sell --- /products?sortBy=sold&order=desc&limit=4
// By arrival --- /products?sortBy=createdAt&order=desc&limit=4

exports.list = async(req,res)=>{
  try{
      let order = req.query.order ? req.query.order : "asc"
      let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
      let limit = req.query.limit ? parseInt(req.query.limit) : 20
      
      let products = await Product.find()
      .select("-photo")
      .populate('category')
      .sort([[sortBy,order]])
      .limit(limit)
      

      if(!products){
        return res.status(400).json({
          error: "product not found"
        })
      }
      // console.log(products)
      res.send(products)
  }
  catch(err){
    console.log(err)
  }
}
 
//  it will find the product based on req.body category
//  other products that has the same category will be returned 
exports.listRelated= async(req,res)=>{  
  try{
    let limit = req.query.limit ? req.query.limit : 20
    let products = await Product.find({_id : {$ne:req.product._id},category:req.product.category})
    .limit(limit)
    .populate('category','_id name')
  
    if(!products){
      return res.status(400).json({
        error: "product not found"
      })
    }
    // console.log(products)
    res.send(products)
  }
  catch(err){
    console.log(err)
  }

}

exports.listCategories = async (req,res)=>{
  try{
    let categories = await Product.distinct("category",{})
    if(!categories){
      return res.status(400).json({
        error: "categories not found"
      })
    }
    // console.log(products)
    res.send(categories)
  }
  catch(err){
    console.log(err)
  }
}

exports.listBySearch = async (req, res) => {
  try{
    let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = parseInt(req.body.skip);
  let findArgs = {};


  for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
          if (key === "price") {
              // gte -  greater than price [0-10]
              // lte - less than
              findArgs[key] = {
                  $gte: req.body.filters[key][0],
                  $lte: req.body.filters[key][1]
              };
          } else {
              findArgs[key] = req.body.filters[key];
          }
      }
  }

  let products = await Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)

      if(!products){
        return res.status(400).json({
          error: "products not found"
        })
      }  

      // res.send(products)
      res.json({
        size: products.length,
        products:products
    });
  }
  catch(err){
    console.log(err)
  }
     
};
exports.listSearch = async (req,res)=>{
  try {
      // creating query object to hold the values of categories and search
  const query = {}
  // assigning search value to query.name
  if(req.query.search){
    query.name = {$regex : req.query.search, $options : 'i'}
  }
  // assigning category value to query.category
  if(req.query.category){
    query.category = req.query.category 
  }
  //  now finding product based on query obj with 2 properties
  let products = await Product.find(query)
      .select("-photo")

      if(!products){
        return res.status(400).json({
          error: "products not found"
        })
      }  

      // res.send(products)
      res.json({
        size: products.length,
        products:products
    });
  } 
  catch (error) {
    console.log(error)
  }
      
}

exports.photo = (req,res,next)=>{
  try{
    if(req.product.photo.data){
      res.set("Content-Type",req.product.photo.contentType);
      return res.send(req.product.photo.data)
    }
    next()
  }
  catch(err){
    console.log(err)
  }
}

exports.allProduct = async(req,res)=>{
  try{
    let products = await Product.find()
    res.json(products)
  }
  catch(err){
    console.log(err)
  }
}


exports.decreaseQuantity = async(req,res,next)=>{
  try{
    let bulkOps = req.body.order.products.map((item)=>{
      return{
          updateOne:{
              filter: {_id : item._id},
              update: {$inc : {quantity : -item.count, sold : +item.count}}
          }
      }
    }) 

    let updateQuantityAndSold = await Product.bulkWrite(bulkOps)

    if(!updateQuantityAndSold){
      return res.status(400).json({
          error:"cannot update product sold and quantity"
      })
    }
    next()
  }
  catch(err){
    console.log(err)
  }
}
exports.decreaseQuantityCod = async(req,res,next)=>{
  try{
    let {products} = req.body.order
    let bulkOps = products.map((item)=>{
      return{
          updateOne:{
              filter: {_id : item._id},
              update: {$inc : {quantity : -item.count, sold : +item.count}}
          }
      }
    }) 

    let updateQuantityAndSold = await Product.bulkWrite(bulkOps)

    if(!updateQuantityAndSold){
      return res.status(400).json({
          error:"cannot update product sold and quantity"
      })
    }
    next()
  }
  catch(err){
    console.log(err)
  }
}

