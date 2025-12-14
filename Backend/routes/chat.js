// const express = require("express");
// const router = express.Router();

// const { requireSignIn, isAuth } = require("../controllers/auth"); // auth middleware
// const { userById } = require("../controllers/user"); // userById middleware

// const chatController = require("../controllers/chat"); // controller handles everything


// // Get chat history with another user
// router.get(
//   "/:userId/with/:withUserId",
//   requireSignIn,
//   isAuth,
//   chatController.getChatHistory
// );

// // Edit a message
// router.put(
//   "/:userId/message/:messageId/edit",
//   requireSignIn,
//   isAuth,
//   chatController.editMessage
// );

// // Delete a message
// router.delete(
//   "/:userId/message/:messageId/delete",
//   requireSignIn,
//   isAuth,
//   chatController.deleteMessage
// );

// // -----------------
// // Middleware to set req.profile based on :userId
// // -----------------
// router.param("userId", userById);

// module.exports = router;
