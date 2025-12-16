const chatController = require("./controllers/chat");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const {validateMessageInput,validateMessageId,validateChatPartner} = require("./helpers/dbErrorHandler");


const onlineUsers = new Map();

// Socket version of requireSignIn
const socketRequireSignIn = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = {
      _id: decoded._id,
      name: decoded.name  
    };
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
};

function initSocket(io) {
  // Step 1: Authenticate socket connection
  io.use(socketRequireSignIn);

 io.on("connection", (socket) => {
    console.log("A User connected:", socket.id);

    if (socket.user) { 
      console.log("Authenticated user:", socket.user._id, socket.user.name);
    }

    // ----- NEW: Send unread counts asynchronously -----
    chatController.getUnreadCounts(socket.user._id)
      .then((unreadCounts) => {
        socket.emit("unread counts", unreadCounts);
        console.log("unread countss->", unreadCounts);
      })
      .catch((err) => {
        console.error("Failed to get unread counts:", err);
      });

    // ===== Existing socket handlers here =====

    // ----- Existing code continues -----
    onlineUsers.set(socket.user._id, socket.id);
    io.emit("online users", Array.from(onlineUsers.keys()));

    // Add authenticated user to online users
    onlineUsers.set(socket.user._id, socket.id);
    io.emit("online users", Array.from(onlineUsers.keys()));

    // ===== PRIVATE MESSAGE =====
    socket.on("private message", async ({ toUserId, message }) => {
      if (!socket.user) return; // socket is authenticated

      // VALIDATION: Cannot message yourself
      if (socket.user._id === toUserId) {
        return socket.emit("error", { message: "Cannot message yourself" });
      }

       // VALIDATION: Input validation
      const validation = validateMessageInput({ toUserId, message });
      if (!validation.isValid) {
        return socket.emit("error", { message: validation.errors[0] });
      }


      const fromUserId = socket.user._id;
      const fromUsername = socket.user.name;

      // Save message securely
      const savedMessage = await chatController.createMessage({
        fromUserId: fromUserId,
        fromUsername: fromUsername,
        toUserId,
        message
      });

      const receiverSocketId = onlineUsers.get(toUserId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private message", savedMessage);

        // Only update unread count if receiver is not in chat with sender
        const receiverChatOpen = false; // you can track this per user in memory
        if (!receiverChatOpen) {
          chatController.getUnreadCounts(toUserId)
            .then((counts) => {
              io.to(receiverSocketId).emit("unread counts", counts);
            })
            .catch((err) => console.error("Failed to send unread counts:", err));
        }
      }

      // Echo message back to sender
      socket.emit("private message", savedMessage);
    });


    //deep seek
    // ===== MARK AS SEEN (FOR REAL-TIME MESSAGES) =====
    socket.on("mark seen", async ({ fromUserId }) => {
      if (!socket.user) return;

      // VALIDATION
      const validation = validateChatPartner(fromUserId);
      if (!validation.isValid) {
        return socket.emit("error", { message: validation.error });
      }
      
      await chatController.markMessagesAsSeen(socket.user._id, fromUserId);
      
      // Optionally, update unread counts
      const allCounts = await chatController.getUnreadCounts(socket.user._id);
      socket.emit("unread counts", allCounts);
    });



    // ===== LOAD CHAT HISTORY =====
    socket.on("load chat", async ({ withUserId }) => {
      if (!socket.user) return;

      // VALIDATION
      const validation = validateChatPartner(withUserId);
      if (!validation.isValid) {
        return socket.emit("error", { message: validation.error });
      }
       // Cannot load chat with yourself
      if (socket.user._id === withUserId) {
        return socket.emit("error", { message: "Cannot chat with yourself" });
      }


      // 1. Mark unseen messages as seen only for this chat
      await chatController.markMessagesAsSeen(socket.user._id, withUserId);

      // 2. Fetch chat history
      const messages = await chatController.getChatHistory(socket.user._id, withUserId);

      // 3. Send chat history
      socket.emit("chat history", messages);

      // 4. Send unread counts **excluding the currently opened chat**
      const allCounts = await chatController.getUnreadCounts(socket.user._id);
      const filteredCounts = { ...allCounts, [withUserId]: 0 }; // force 0 for current chat
      socket.emit("unread counts", filteredCounts);
    });

    // ===== EDIT MESSAGE =====
    socket.on("message edited", async ({ messageId, newText, toUserId }) => {
      if (!socket.user) return;

      // VALIDATION: Message ID and new text
      const validation = validateMessageId(messageId, socket.user._id);
      if (!validation.isValid) {
        return socket.emit("error", { message: validation.errors[0] });
      }

      if (!newText || typeof newText !== "string" || newText.trim().length === 0) {
        return socket.emit("error", { message: "Invalid message text" });
      }

      if (newText.trim().length > 1000) {
        return socket.emit("error", { message: "Message too long" });
      }

      // VALIDATION: toUserId
      const partnerValidation = validateChatPartner(toUserId);
      if (!partnerValidation.isValid) {
        return socket.emit("error", { message: partnerValidation.error });
      }


      const msg = await chatController.editMessage(socket.user._id,messageId,newText);


      const receiverSocketId = onlineUsers.get(toUserId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message edited", msg);
      }

      // Update sender
      socket.emit("message edited", msg);
    });

    // ===== DELETE MESSAGE =====
    socket.on("message deleted", async ({ messageId, toUserId }) => {
      if (!socket.user) return;

       // VALIDATION
      const validation = validateMessageId(messageId, socket.user._id);
      if (!validation.isValid) {
        return socket.emit("error", { message: validation.errors[0] });
      }

      const partnerValidation = validateChatPartner(toUserId);
      if (!partnerValidation.isValid) {
        return socket.emit("error", { message: partnerValidation.error });
      }


      const msg = await chatController.deleteMessage(socket.user._id,messageId)

      const receiverSocketId = onlineUsers.get(toUserId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("message deleted", msg);
      }

      // Update sender
      socket.emit("message deleted", msg);
    });

     // ===== ERROR HANDLER =====
    socket.on("error", (error) => {
      console.error("Socket error from client:", error);
    });

    // ===== DISCONNECT =====
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.user._id);
      io.emit("online users", Array.from(onlineUsers.keys()));
      console.log("User disconnected:", socket.user.name);
    });
  });
}

module.exports = initSocket;
 