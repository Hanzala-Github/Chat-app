import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import {
  emitToChatParticipants,
  emitToUser,
  getReceiverSocketId,
  io,
  // userSocketMap,
} from "../lib/socket.js";
import { generateChatId } from "../utils/generateChatId.js";

const getUsersForSidebar = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
    }

    const loggedInUser = req.user._id;
    // const filteredUsers = await User.find({
    //   _id: { $ne: loggedInUser },
    // }).select("-password");
    const filteredUsers = await User.find(
      { _id: { $ne: loggedInUser } },
      { password: 0 }
    ).lean();

    return res.status(200).json({
      success: true,
      users: filteredUsers,
      message: "All users fetched successfully",
    });
  } catch (error) {
    console.error(`Error in getUsersForSidebar controller: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ..........getMessages controller...........//

const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      deletedBy: { $ne: myId },
    })
      .sort({ createdAt: 1 })
      .populate("replyTo") //this line is new
      .lean();

    return res.status(200).json({
      success: true,
      messages: messages,
      message: "Get both user messages successfully",
    });
  } catch (error) {
    console.error(`Error in getMessages controller: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ............sendMessage controller............//
const sendMessage = async (req, res, next) => {
  const { id: receiverId } = req.params;
  const senderId = req.user?._id;
  const { text, image, isReply, replyTo } = req.body;

  try {
    if (!senderId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!receiverId || (!text && !image)) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and message content are required",
      });
    }

    // Ensure receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver not found" });
    }

    const chatId = generateChatId(senderId, receiverId);

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse?.secure_url;
    }

    // Create a new message (single message, no `messages` array)
    const newMessage = await Message.create({
      chatId,
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isReply,
      replyTo,
    });
    await newMessage.populate("replyTo");

    // ---------------socket-------------------//
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId && receiverSocketId.length > 0) {
      // const participantIds = [senderId.toString(), receiverId.toString()];
      // emitToChatParticipants(participantIds, "receiveMessage", newMessage);

      emitToChatParticipants(
        [senderId.toString(), receiverId.toString()],
        "newMessage",
        newMessage
      );
    }
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("newMessage", newMessage);
    // }
    console.log(newMessage);
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
      receiverIsOnline: receiverSocketId.length > 0,
    });
  } catch (error) {
    console.error(`Error in sendMessage controller: ${error}`);
    next(error);
  }
};

// ..........deleteMessagesHistory controller.....................//

const deleteMessagesHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const myId = req.user._id;

    // Update messages instead of deleting them
    await Message.updateMany(
      {
        $or: [
          { senderId: myId, receiverId: id },
          { senderId: id, receiverId: myId },
        ],
      },
      { $addToSet: { deletedBy: myId } } // Add myId to deletedBy array
    );

    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: id },
        { senderId: id, receiverId: myId },
      ],
      $expr: { $eq: [{ $size: "$deletedBy" }, 2] },
    });

    return res.status(200).json({
      success: true,
      message:
        "Messages hidden for you. Deleted permanently if both have cleared.",
    });
  } catch (error) {
    console.error(`Error in deleteMessagesHistory controller:`, error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// ..................deleteSingleMessage....................//
const deleteMessageForMe = async (req, res) => {
  // const { messageId } = req.params;
  // const myId = req.user._id;

  // try {

  // .........This is my old code but best code.......//
  // await Message.updateOne(
  //   { _id: messageId },
  //   {
  //     $addToSet: { deletedBy: myId.toString() },
  //   }
  // );
  // await Message.updateOne({ replyTo: messageId }, { isReply: false });
  // await Message.deleteOne({
  //   _id: messageId,
  //   $expr: { $eq: [{ $size: "$deletedBy" }, 2] },
  // });
  // return res
  //   .status(200)
  //   .json({ success: true, message: "Message delete for you successfully" });
  // } catch (error) {
  //   console.error("Error in deleteMessageForMe:", error);
  //   return res
  //     .status(500)
  //     .json({ success: false, message: "Internal Server Error" });
  // }

  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // If user already deleted
    if (message.deletedBy.includes(userId)) {
      return res.status(400).json({ error: "Already deleted" });
    }

    // Push user to deletedBy array
    message.deletedBy.push(userId);

    if (message.deletedBy.length < 2) {
      // Case 1: First user deletes → Just save
      await message.save();
      return res.status(200).json({ message: "Deleted for you only" });
    } else {
      // Case 2: Second user deletes → Remove from DB + set isReply = false for replies
      // First, update any messages that reply to this one
      await Message.updateMany(
        { replyTo: messageId },
        { $set: { isReply: false, replyTo: null } }
      );

      // Then delete the original message
      await Message.findByIdAndDelete(messageId);

      return res.status(200).json({ message: "Message deleted for everyone" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
const deleteMessageForEveryOne = async (req, res) => {
  const { messageId } = req.params;
  const myId = req.user._id;
  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    if (message.senderId.toString() !== myId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this message for everyone",
      });
    }

    await Message.findByIdAndDelete(messageId);
    return res.status(200).json({
      success: true,
      message: "Message deleted for everyone",
    });
  } catch (error) {
    console.error("Error in deleteMessageForEveryOne:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// .........export........//
export {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  deleteMessagesHistory,
  deleteMessageForMe,
  deleteMessageForEveryOne,
};
