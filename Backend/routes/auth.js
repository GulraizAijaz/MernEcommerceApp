const express = require("express");
const router = express.Router();
const {signUp,signIn,signOut,hello} = require("../controllers/auth");
const {userSignUpValidator } = require('../validator/index'); // Corrected import
 

router.post("/signup", userSignUpValidator, signUp);
router.post("/signin",signIn)
router.get("/signout",signOut)
router.get("/",hello)

//  

module.exports = router;

