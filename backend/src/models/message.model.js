// import mongoose, { Schema } from "mongoose";

// const messageSchema = new Schema(
//   {
//     senderId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//     },
//     image: {
//       type: String,
//     },
//     isReply: {
//       type: Boolean,
//       default: false,
//     },
//     deletedBy: {
//       type: [String],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

// const Message =
//   mongoose.models?.Message || mongoose.model("Message", messageSchema);

// export default Message;
import mongoose, { Schema, Document } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },

    // ✅ This is your existing reply flag
    isReply: {
      type: Boolean,
      default: false,
    },

    // ✅ This is the NEW field — reference to the replied message
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // ✅ Optional: who deleted the message
    deletedBy: {
      type: [String],
      default: [],
    },
    isDeleteForMe: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for performance
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

const Message =
  mongoose.models?.Message || mongoose.model("Message", messageSchema);

export default Message;
