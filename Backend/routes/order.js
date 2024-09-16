const express = require("express");
const router = express.Router();
const {requireSignIn,isAuth,isAdmin} = require("../controllers/auth");
const {userById,
       addOrderToUserHistory,
       addOrderToUserHistoryCod
    } = require("../controllers/user");
const {create,
    listOrders,
    getStatusValues,
    orderById,
    updateOrderStatus,
    addTransactionIdToCod
} = require("../controllers/order")
const {decreaseQuantity,decreaseQuantityCod} = require('../controllers/product')

router.post(
    "/order/create/:userId",
    requireSignIn,
    isAuth,
    addOrderToUserHistory,
    decreaseQuantity,
    create
)
router.post(
    "/order/create/cod/:userId",
    requireSignIn,
    isAuth,
    addTransactionIdToCod,
    addOrderToUserHistoryCod,
    decreaseQuantityCod,
    create
)
router.get("/order/list/:userId",
            requireSignIn,
            isAuth,
            isAdmin,
            listOrders)
router.get("/order/status-value/:userId",
            requireSignIn,
            isAuth,
            isAdmin,
            getStatusValues)
router.put("/order/:orderId/status/:userId",
            requireSignIn,
            isAuth,
            isAdmin,
            updateOrderStatus)

router.param("userId",userById) 
router.param("orderId",orderById) 

module.exports = router;