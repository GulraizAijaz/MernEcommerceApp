const express = require("express");
const router = express.Router();
const {create,categoryById,getCategoriesList,read,update,remove} = require("../controllers/category");
const {isAuth,isAdmin,requireSignIn} = require('../controllers/auth')
 const {userById} = require('../controllers/user')


router.post("/category/create/:userId",requireSignIn,isAdmin,isAuth, create);
router.get('/category/getcategories',getCategoriesList)
router.get('/category/:categoryId',read)
router.put("/category/update/:userId",requireSignIn,isAdmin,isAuth,update)
router.delete("/category/delete/:userId",requireSignIn,isAdmin,isAuth,remove)


router.param("userId",userById)
router.param("categoryId",categoryById)

module.exports = router;
