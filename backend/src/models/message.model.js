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

//     // ✅ This is your existing reply flag
//     isReply: {
//       type: Boolean,
//       default: false,
//     },

//     // ✅ This is the NEW field — reference to the replied message
//     replyTo: {
//       type: Schema.Types.ObjectId,
//       ref: "Message",
//       default: null,
//     },

//     // ✅ Optional: who deleted the message
//     deletedBy: {
//       type: [String],
//       default: [],
//     },
//     isDeleteForMe: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// // Indexes for performance
// messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

// const Message =
//   mongoose.models?.Message || mongoose.model("Message", messageSchema);

// export default Message;

import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    // chatId is a stable string ID generated from two user IDs (e.g. "607_809")
    chatId: {
      type: String,
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: { type: String, trim: true },
    image: { type: String },

    isReply: { type: Boolean, default: false },
    replyTo: { type: Schema.Types.ObjectId, ref: "Message", default: null },

    deletedBy: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    isDeleteForMe: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
      index: true,
    },

    seenAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Indexes for fast lookups
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, status: 1 });

// Static helper
messageSchema.statics.updateStatus = async function (messageId, status) {
  return this.findByIdAndUpdate(
    messageId,
    { status, ...(status === "seen" && { seenAt: new Date() }) },
    { new: true }
  );
};

const Message =
  mongoose.models?.Message || mongoose.model("Message", messageSchema);

export default Message;
