const Category = require("../models/category")

exports.read = async (req,res)=>{
    res.json(req.category)
}


exports.categoryById = async (req,res,next,id) => {
try{
    const category = await Category.findById(id);
    if(!category){
     return res.status(400).json({
       err:"category not found "
     })
   }
     req.category = category
     next()
}   
catch(err){
    return res.status(500).json({
        error : err,
        message:"server error try again later"
    })
} 
}

exports.create = async (req, res) => {
try{
    const {name} = req.body
    console.log(name)
    const categoryExist = await Category.findOne({name:name })
    if (categoryExist){
        res.status(400).json({error:"category exist already"})
    }
    else{
        const category = new Category(req.body)
        await category.save()
        res.status(200).json({
            success : "category created"
        })
    }
}
catch(err){
    console.log(err)
}
    
};


exports.getCategoriesList = async (req, res) => {
try{
    const categories = await Category.find()
    if (!categories){
        res.status(400).json({error:'no category available'})
    }
    else
        res.status(200).send(categories)
}
catch(err){
    console.log(err)
}
}

exports.update = async(req,res)=>{
try{
    const category = req.category
    category.name = req.body.name
    const updatedcategory = await category.save()
    if(!updatedcategory){
        return res.status(400).json({
            error : " cannot update category"
        })
    }
    res.status(200).json({
        msg: "category updated",
        updatedcategory
    })
}
catch(err){
    console.log(err)
}
}


exports.remove = async(req,res)=>{
try{
    let categoryId = req.category.id
    const categoryRemoved = await Category.findByIdAndDelete(categoryId);
    if(!categoryRemoved){
      return res.status(400).json({
        error : " cannot delete this category or category not found"
      })
    }
    res.status(200).json({
      msg: "category is deleted seccessfully",
      category: categoryRemoved
    })
}
catch(err){
    console.log(err)
}
}
    
