// // ______I don't get the selectUser id in typing and stop_typing event like chatId so fix this______//

// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import Message from "../models/message.model.js";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//   },
// });

// // Used to store online users

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId] || [];
// }
// export const userSocketMap = {}; // {userId: socketId}

// export function emitToUser(userId, event, payload) {
//   const socketId = userSocketMap[userId];
//   console.log("socketIdsocketIdsocketIdsocketIdsocketIdsocketId", socketId);
//   if (!socketId || socketId.length === 0) return;

//   socketId.forEach((socId) => {
//     io.to(socId).emit(event, payload);
//   });
// }

// io.on("connection", (socket) => {
//   console.log("A user connected : ", socket.id);

//   const userId = socket.handshake.query?.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   console.log("HANDSHACK", userId, socket.id);

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // .............. Join-chat to listen ...............//
//   socket.on("join_chat", (chatId) => {
//     console.log(`join_chat ${chatId}`);
//     socket.join(chatId);
//   });
//   // .............. leave-chat to listen ...............//

//   socket.on("leave_chat", (chatId) => {
//     console.log(`leave_chat ${chatId}`);
//     socket.leave(chatId);
//   });

//   // .........deleteMessageForEveryone......//
//   socket.on("deleteMessageForEveryone", ({ messageId, receiverId }) => {
//     const receiverSocketId = userSocketMap[receiverId];

//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("receiveDeletedMessage", { messageId });
//     }
//   });

//   socket.on("typing", ({ chatId, userId }) => {
//     console.log("typing :", { chatId, userId });

//     // socket.to(chatId).emit("typing", { chatId, userId });
//     io.to(chatId).emit("typing", { chatId, userId });
//   });
//   socket.on("stop_typing", ({ chatId, userId }) => {
//     console.log("stop_typing :", { chatId, userId });

//     // socket.to(chatId).emit("stop_typing", { chatId, userId });
//     io.to(chatId).emit("stop_typing", { chatId, userId });
//   });

//   // ----------------markMessagesAsSeen----------------------//

//   socket.on("markMessagesAsSeen", async ({ chatId, userId }) => {
//     try {
//       const updated = await Message.updateMany(
//         {
//           chatId,
//           receiverId: userId,
//           status: { $ne: "seen" },
//         },

//         { $set: { status: "seen", seenAt: new Date() } }
//       );

//       if (updated.modifiedCount > 0) {
//         const chatMessages = await Message.find({ chatId }).select("senderId");
//         const uniqueSenders = [
//           ...new Set(chatMessages.map((m) => m.senderId.toString())),
//         ];

//         uniqueSenders.forEach((senderId) => {
//           const senderSocket = userSocketMap[senderId];
//           console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS", senderSocket);
//           senderSocket.forEach(
//             (sockId) => io.to(sockId).emit("messagesSeen", { chatId })
//             // if (senderSocket) {
//             //   io.to(senderSocket).emit("messagesSeen", { chatId });
//             // }
//           );
//         });
//       }
//     } catch (error) {
//       console.error("Error marking messages as seen : ", error);
//     }
//   });

//   // ...........disconnect..............//

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// // ---------------emitToUser----------------//

// export { io, app, server };

// socketServer.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// ------------------- USER SOCKET MANAGEMENT ------------------- //

/**
 * userSocketMap structure:
 * {
 *   userId1: [socketId1, socketId2],
 *   userId2: [socketId3],
 * }
 */
export const userSocketMap = {};

// Get the active socket IDs of a user
export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || [];
}

// Emit to a specific user's all sockets
export function emitToUser(userId, event, payload) {
  if (!userId || !event) return;
  const socketIds = userSocketMap[userId];
  console.log("socketIdssocketIdssocketIds", socketIds);
  if (!socketIds || socketIds.length === 0) return;

  // In this case i need to send both ids in this socketIds like i get in other corners in this whole code and emit this event on both user like sent

  socketIds.forEach((socketId) => {
    io.to(socketId).emit(event, payload);
  });
}

var pluse = 0;
export function emitToChatParticipants(
  participantIds = [],
  event,
  payload = {}
) {
  pluse++;
  if (!Array.isArray(participantIds) || participantIds.length === 0 || !event)
    return;

  const uniqueIds = [...new Set(participantIds.map(String))];
  console.log(`UUUUUUNNNNNNNIIIIIQUUUUUUUUEEEEEEE ${pluse}`, uniqueIds);

  uniqueIds.forEach((userId) => {
    emitToUser(userId, event, payload);
  });
}

// -------------------markUndeliveredMessagesAsDelivered function-------------------//

// async function markUndeliveredMessagesAsDelivered(userId) {
//   if (!userId) return;

//   const receiverSocketIds = getReceiverSocketId(userId);

//   if (!receiverSocketIds || receiverSocketIds.length === 0) return;

//   const undeliveredMessages = await Message.find({
//     receiverId: userId,
//     status: "sent",
//   });

//   if (undeliveredMessages.length === 0) return;

//   for (const msg of undeliveredMessages) {
//     await Message.updateStatus(msg._id, "delivered");

//     const participantsIds = [
//       msg.senderId.toString(),
//       msg.receiverId.toString(),
//     ];

//     emitToChatParticipants(participantsIds, "messageStatusUpdate", {
//       chatId: msg.chatId,
//       messageId: msg._id,
//       status: "delivered",
//     });
//   }
// }

async function markUndeliveredMessagesAsDelivered(userId) {
  if (!userId) return;
  const undeliveredMessages = await Message.find({
    receiverId: userId,
    status: "sent",
  });

  if (!undeliveredMessages.length) return;

  for (const msg of undeliveredMessages) {
    await Message.updateStatus(msg._id, "delivered");

    emitToChatParticipants(
      [msg.senderId.toString(), msg.receiverId.toString()],
      "messageStatusUpdate",
      {
        chatId: msg.chatId,
        messageId: msg._id,
        status: "delivered",
      }
    );
  }
}

// ------------------- SOCKET CONNECTION ------------------- //

io.on("connection", async (socket) => {
  console.log("🔌 A user connected:", socket.id);

  const userId = socket.handshake.query?.userId;

  if (userId) {
    // If user already connected from other tabs/devices
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    if (!userSocketMap[userId].includes(socket.id)) {
      userSocketMap[userId].push(socket.id);
    }
  }

  console.log("🧩 userSocketMap:", userSocketMap);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ------------------- JOIN / LEAVE CHAT ------------------- //

  socket.on("join_chat", (chatId) => {
    console.log(`📥 join_chat: ${chatId}`);
    socket.join(chatId);
  });

  socket.on("leave_chat", (chatId) => {
    console.log(`📤 leave_chat: ${chatId}`);
    socket.leave(chatId);
  });

  // -------------ticks functionality related----------------//

  // socket.on("userActive", async () => {
  //   console.log("User active again", userId);
  //   await markUndeliveredMessagesAsDelivered(userId);
  // });

  // On connection
  socket.on("userActive", async () => {
    console.log("🟢 User active:", userId);
    await markUndeliveredMessagesAsDelivered(userId);
  });

  // New event triggered from ChatBubble
  socket.on(
    "markMessageDelivered",
    async ({ chatId, messageId, receiverId }) => {
      try {
        // update status in DB
        await Message.updateStatus(messageId, "delivered");

        const msg = await Message.findById(messageId);
        if (!msg) return;

        const participants = [
          msg.senderId.toString(),
          msg.receiverId.toString(),
        ];

        // emit to both
        emitToChatParticipants(participants, "messageStatusUpdate", {
          chatId,
          messageId,
          status: "delivered",
        });
      } catch (err) {
        console.error("Error marking message delivered:", err);
      }
    }
  );

  // ------------------- TYPING EVENTS ------------------- //

  socket.on("typing", ({ chatId, userId }) => {
    if (!chatId || !userId) return;
    console.log("✏️ typing:", { chatId, userId });
    socket.to(chatId).emit("typing", { chatId, userId });
  });

  socket.on("stop_typing", ({ chatId, userId }) => {
    if (!chatId || !userId) return;
    console.log("🛑 stop_typing:", { chatId, userId });
    socket.to(chatId).emit("stop_typing", { chatId, userId });
  });

  // ------------------- DELETE MESSAGE ------------------- //

  socket.on("deleteMessageForEveryone", ({ messageId, receiverId }) => {
    const receiverSocketIds = getReceiverSocketId(receiverId);
    receiverSocketIds.forEach((id) =>
      io.to(id).emit("receiveDeletedMessage", { messageId })
    );
  });

  // ------------------- MARK MESSAGES AS SEEN ------------------- //

  socket.on("markMessagesAsSeen", async ({ chatId, userId }) => {
    try {
      const updated = await Message.updateMany(
        {
          chatId,
          receiverId: userId,
          status: { $ne: "seen" },
        },
        { $set: { status: "seen", seenAt: new Date() } }
      );

      if (updated.modifiedCount > 0) {
        const chatMessages = await Message.find({ chatId }).select(
          "senderId receiverId"
        );
        const participantIds = [
          ...new Set(
            chatMessages.flatMap((m) => [
              m.senderId.toString(),
              m.receiverId.toString(),
            ])
          ),
        ];

        emitToChatParticipants(participantIds, "messagesSeen", { chatId });

        // participantIds.forEach((senderId) => {
        //   emitToUser(senderId, "messagesSeen", { chatId });
        // });
      }
    } catch (error) {
      console.error("❌ Error marking messages as seen:", error);
    }
  });

  // ......update status delivered.........//

  // const receiverSocketId = getReceiverSocketId(userId);

  // const undeliveredMessages = await Message.find({
  //   receiverId: userId,
  //   status: "sent",
  // });

  // if (undeliveredMessages.length > 0) {
  //   for (const msg of undeliveredMessages) {
  //     await Message.updateStatus(msg._id, "delivered");
  //     const participantsIds = [
  //       msg.senderId.toString(),
  //       msg.receiverId.toString(),
  //     ];

  //     emitToChatParticipants(participantsIds, "messageStatusUpdate", {
  //       chatId: msg.chatId,
  //       messageId: msg._id,
  //       status: "delivered",
  //     });
  //   }
  // }

  // ------------------- DISCONNECT ------------------- //

  socket.on("disconnect", () => {
    console.log("🚫 A user disconnected:", socket.id);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id
      );
      if (userSocketMap[userId].length === 0) delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ------------------- EXPORTS ------------------- //

export { io, app, server };
