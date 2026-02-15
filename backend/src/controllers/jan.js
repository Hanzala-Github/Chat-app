// import Message from "../models/message.model.js";
// import Chat from "../models/chat.model.js";

// // Map of online users: userId -> socketId
// const userSocketMap = new Map();

// export const registerHandlers = (io, socket) => {
//   // 1️⃣ User connected
//   socket.on("register", (userId) => {
//     userSocketMap.set(userId, socket.id);
//     socket.userId = userId;
//   });

//   // 2️⃣ Send message (✓)
//   socket.on("sendMessage", async (data) => {
//     const { chatId, senderId, receiverId, text, image } = data;

//     const newMessage = await Message.create({
//       chatId,
//       senderId,
//       receiverId,
//       text,
//       image,
//     });

//     // Emit to sender → "sent" tick
//     io.to(socket.id).emit("messageStatusUpdate", {
//       messageId: newMessage._id,
//       status: "sent",
//     });

//     // Deliver if receiver online
//     const receiverSocket = userSocketMap.get(receiverId);
//     if (receiverSocket) {
//       // Send message to receiver
//       io.to(receiverSocket).emit("receiveMessage", newMessage);

//       // Update and notify sender → "delivered" tick
//       await Message.updateStatus(newMessage._id, "delivered");

//       io.to(socket.id).emit("messageStatusUpdate", {
//         messageId: newMessage._id,
//         status: "delivered",
//       });
//     }
//   });

//   // 3️⃣ Mark messages as seen (✓✓ blue)
//   socket.on("markMessagesAsSeen", async ({ chatId, userId }) => {
//     const updated = await Message.updateMany(
//       { chatId, receiverId: userId, status: { $ne: "seen" } },
//       { $set: { status: "seen", seenAt: new Date() } },
//     );

//     if (updated.modifiedCount > 0) {
//       // Notify sender that these messages were seen
//       const chatMessages = await Message.find({ chatId }).select("senderId");
//       const uniqueSenders = [
//         ...new Set(chatMessages.map((m) => m.senderId.toString())),
//       ];

//       uniqueSenders.forEach((senderId) => {
//         const senderSocket = userSocketMap.get(senderId);
//         if (senderSocket) {
//           io.to(senderSocket).emit("messagesSeen", { chatId });
//         }
//       });
//     }
//   });

//   // 4️⃣ Handle disconnect
//   socket.on("disconnect", () => {
//     if (socket.userId) userSocketMap.delete(socket.userId);
//   });
// };
