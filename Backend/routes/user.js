const express = require("express");
const router = express.Router();
const {requireSignIn,
        isAuth,
        isAdmin
    } = require("../controllers/auth");
const {
        userById,
        adminUserbyId,
        read,
        update,
        remove,
        purchaseHistory,
        allUsers,
        userReadForAdmin,
        updateByAdmin,
        userDeleteByAdmin
      } = require("../controllers/user");   

router.get('/user/:userId',requireSignIn,isAuth,read)
router.put('/user/update/:userId',requireSignIn,isAuth,update)
router.delete('/user/remove/:userId',requireSignIn,isAuth,remove)
router.get('/orders/by/user/:userId',requireSignIn,isAuth,purchaseHistory)
router.get('/users/all/:userId',requireSignIn,isAuth,isAdmin,allUsers)
router.post('/user/update/:userId/:updateId',requireSignIn,isAuth,isAdmin,updateByAdmin)
router.get('/user/get/:userId/:updateId',requireSignIn,isAuth,isAdmin,userReadForAdmin)
router.delete('/user/delete/:userId/:updateId',requireSignIn,isAuth,isAdmin,userDeleteByAdmin)


 
router.param("userId",userById) 
router.param("updateId",adminUserbyId) 
 

module.exports = router;

