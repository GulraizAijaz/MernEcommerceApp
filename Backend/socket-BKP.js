const Message = require("./models/message");

const onlineUsers = new Map();

 function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("A User connected:", socket.id);
    
    // Register user with name + id
    socket.on("register", ({ userId, username }) => {
      onlineUsers.set(userId, socket.id);
      
      io.emit("online users", Array.from(onlineUsers.keys()));

      socket.userId = userId;
      socket.username = username;
    });
    
    // Private message
    socket.on("private message", async ({ toUserId, message }) => {
      if (!socket.userId) return;

      // Save message
      await Message.create({
        fromUserId: socket.userId,
        fromUsername: socket.username,
        toUserId,
        message
      });

      const receiverSocketId = onlineUsers.get(toUserId);

      // Send to receiver
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private message", {
          fromUserId: socket.userId,
          fromUsername: socket.username,
          message
        });
      }

      // Send to sender (local)
      socket.emit("private message", {
        fromUserId: socket.userId,
        fromUsername: socket.username,
        message
      }); 
    });


        //delete edit
    // Message edited
      socket.on("message edited", (message) => {
        const receiverSocketId = onlineUsers.get(message.toUserId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message edited", message);
        }
      });
      // Message deleted
      socket.on("message deleted", (message) => {
        const receiverSocketId = onlineUsers.get(message.toUserId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message deleted", message);
        }
      });

    //delete edit ends


    // Load chat history
    socket.on("load chat", async ({ withUserId }) => {
      const messages = await Message.find({
        $or: [
          { fromUserId: socket.userId, toUserId: withUserId },
          { fromUserId: withUserId, toUserId: socket.userId }
        ]
      }).sort({ timestamp: 1 });

      socket.emit("chat history", messages);
    });


    // Disconnect
    socket.on("disconnect", () => {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) onlineUsers.delete(userId);
      }
      io.emit("online users", Array.from(onlineUsers.keys()));

    });

  });
}

module.exports = initSocket;
