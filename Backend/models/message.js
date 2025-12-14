// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema(
//   {
//     fromUserId: { type: String, required: true },
//     fromUsername: { type: String, required: true },

//     toUserId: { type: String, required: true },
 
//     message: { type: String, required: true },

//     edited: { type: Boolean, default: false },
//     deleted: { type: Boolean, default: false }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Message", messageSchema);

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    fromUserId: { type: String, required: true },
    fromUsername: { type: String, required: true },
    toUserId: { type: String, required: true },
    message: { type: String, required: true },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    seen: { type: Boolean, default: false } // <-- NEW FIELD
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
