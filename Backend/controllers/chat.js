// controllers/chatController.js
const Message = require("../models/message");

exports.createMessage = async ({ fromUserId, fromUsername, toUserId, message }) => {
  return await Message.create({ fromUserId, fromUsername, toUserId, message });
};

exports.getChatHistory = async (userId, withUserId) => {
  const messages = await Message.find({
    $or: [
      { fromUserId: userId, toUserId: withUserId },
      { fromUserId: withUserId, toUserId: userId }
    ]
  })
    .sort({ createdAt: 1 })
    .lean(); // <-- THIS FIXES THE ERROR

  return messages.map((msg) => {
    if (msg.deleted) {
      msg.message = "";
      msg.createdAt = null;
    }
    return msg;
  });
};


exports.editMessage = async (userId, messageId, newText) => {
  const msg = await Message.findOne({ _id: messageId, fromUserId: userId });
  if (!msg) return null;

  msg.message = newText;
  msg.edited = true;
  return await msg.save();
};

exports.deleteMessage = async (userId, messageId) => {
  const msg = await Message.findOne({ _id: messageId, fromUserId: userId });
  if (!msg) return null;

  msg.deleted = true;
  return await msg.save();
};


exports.markMessagesAsSeen = async (fromUserId, toUserId) => {
  await Message.updateMany(
    { fromUserId, toUserId, seen: false },
    { $set: { seen: true } }
  );
};

// Returns unread count per sender for a user
exports.getUnreadCounts = async (userId) => {
  const counts = await Message.aggregate([
    { $match: { toUserId: userId, seen: false } },
    { $group: { _id: "$fromUserId", count: { $sum: 1 } } }
  ]);

  // Convert to object { senderId: count }
  const result = {};
  counts.forEach(c => {
    result[c._id] = c.count;
  });

  return result;
};
