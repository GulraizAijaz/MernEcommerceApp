const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload')
const {create,
       productById,
       read,
       remove,
       update,
       list,
       listRelated,
       listCategories,
       listBySearch,
       listSearch,
       photo,
       allProduct
    } = require("../controllers/product");
    
const {isAuth,isAdmin,requireSignIn} = require('../controllers/auth')
 const {userById} = require('../controllers/user')
 
router.post("/product/create/:userId",requireSignIn,isAdmin,isAuth,upload.single('photo'),create);
router.get("/product/:productId",read)
router.delete("/product/delete/:productId/:userId",requireSignIn,isAdmin,isAuth,remove)
router.put("/product/update/:productId/:userId",requireSignIn,isAdmin,isAuth,upload.single('photo'),update)
router.get("/products/search", listSearch);
router.get("/products",list)
router.get("/products/related/:productId",listRelated)
router.get("/products/categories",listCategories)
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId",photo)
// router.get("/allproducts",allProduct)

router.param("userId",userById)
router.param("productId",productById)

module.exports = router;
