// // SocketController.jsx

// import React, { useEffect, useRef } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { useStates } from "../store/useStates";
// import { getChatId } from "../lib/utils";
// import { useQueryClient } from "@tanstack/react-query";

// export function SocketController() {
//   const socket = useAuthStore((s) => s.socket);
//   const authUser = useAuthStore((s) => s.authUser);
//   const selectedUser = useStates((s) => s.selectedUser);
//   const queryClient = useQueryClient();

//   const lastSeenEmitRef = useRef(0);

//   useEffect(() => {
//     if (!socket || !authUser?._id || !selectedUser) return;

//     const chatId = getChatId(authUser._id, selectedUser);

//     // ---------- SEEN THROTTLE ----------
//     const emitSeen = () => {
//       const now = Date.now();
//       if (now - lastSeenEmitRef.current > 2000) {
//         socket.emit("markMessagesAsSeen", { chatId, userId: authUser._id }); //
//         lastSeenEmitRef.current = now;
//       }
//     };

//     emitSeen(); // on open

//     // ---------- NEW MESSAGE ----------
//     const onNewMessage = (message) => {
//       const msgChatId = getChatId(message.senderId, message.receiverId);

//       queryClient.setQueryData(["messages", msgChatId], (old = []) => {
//         if (old.some((m) => m._id === message._id)) return old;
//         return [...old, message];
//       });

//       if (msgChatId === chatId && message.receiverId === authUser._id) {
//         socket.emit("markMessageDelivered", {
//           //
//           chatId,
//           messageId: message._id,
//           receiverId: authUser._id,
//         });
//         emitSeen();
//       }
//     };

//     // ---------- STATUS UPDATE ----------
//     const onStatus = ({ chatId, messageId, status }) => {
//       queryClient.setQueryData(["messages", chatId], (old = []) =>
//         old.map((m) => (m._id === messageId ? { ...m, status } : m)),
//       );
//     };

//     // ---------- CHAT SEEN ----------
//     const onSeen = ({ chatId }) => {
//       queryClient.setQueryData(["messages", chatId], (old = []) =>
//         old.map((m) => ({ ...m, status: "seen" })),
//       );
//     };

//     // const onSeen = ({ chatId, seenAt }) => {
//     //   queryClient.setQueryData(["messages", chatId], (old) => {
//     //     old.map((m) => {
//     //       if (new Date(m.createdAt) <= new Date(seenAt)) {
//     //         return { ...m, status: "seen" };
//     //       }
//     //       return m;
//     //     });
//     //   });
//     // };

//     // ---------- TYPING ----------
//     const onTyping = ({ chatId, userId }) => {
//       useStates.getState().setTyping(chatId, userId, true);
//     };

//     const onStopTyping = ({ chatId, userId }) => {
//       useStates.getState().setTyping(chatId, userId, false);
//     };

//     // ---------- DELETE ----------
//     const onDeleted = ({ messageId }) => {
//       queryClient.setQueryData(["messages", chatId], (old = []) =>
//         old.filter((m) => m._id !== messageId),
//       );
//     };

//     socket.on("newMessage", onNewMessage); //
//     socket.on("messageStatusUpdate", onStatus); //
//     socket.on("messagesSeen", onSeen); //
//     socket.on("typing", onTyping); //
//     socket.on("stop_typing", onStopTyping); //
//     socket.on("receiveDeletedMessage", onDeleted); //

//     return () => {
//       socket.off("newMessage", onNewMessage);
//       socket.off("messageStatusUpdate", onStatus);
//       socket.off("messagesSeen", onSeen);
//       socket.off("typing", onTyping);
//       socket.off("stop_typing", onStopTyping);
//       socket.off("receiveDeletedMessage", onDeleted);
//     };
//   }, [socket, authUser?._id, selectedUser]);

//   return null;
// }
// ---------------------22222222----------------------//
// SocketController.jsx
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useStates } from "../store/useStates";
import { getChatId } from "../lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export function SocketController() {
  const socket = useAuthStore((s) => s.socket);
  const authUser = useAuthStore((s) => s.authUser);
  const selectedUser = useStates((s) => s.selectedUser);
  const queryClient = useQueryClient();

  const lastSeenEmitRef = useRef(0);

  useEffect(() => {
    if (!socket || !authUser?._id || !selectedUser) return;

    const chatId = getChatId(authUser._id, selectedUser);

    // ---------- SEEN THROTTLE ----------
    const emitSeen = () => {
      const now = Date.now();
      if (now - lastSeenEmitRef.current > 2000) {
        socket.emit("markMessagesAsSeen", { chatId, userId: authUser._id });
        lastSeenEmitRef.current = now;
      }
    };

    emitSeen(); // when chat opens

    // ---------- NEW MESSAGE ----------
    const onNewMessage = (message) => {
      const msgChatId = getChatId(message.senderId, message.receiverId);

      // if (message.senderId === authUser._id) {
      //   return;
      // }

      queryClient.setQueryData(["messages", msgChatId], (old = []) => {
        if (old.some((m) => m._id === message._id)) return old;
        return [...old, message];
      });

      // Auto delivered + seen
      if (msgChatId === chatId && message.receiverId === authUser._id) {
        socket.emit("markMessageDelivered", {
          chatId,
          messageId: message._id,
          receiverId: authUser._id,
        });
        emitSeen();
      }
    };

    // ---------- STATUS UPDATE ----------
    const onStatus = ({ chatId, messageId, status }) => {
      queryClient.setQueryData(["messages", chatId], (old = []) =>
        old.map((m) => (m._id === messageId ? { ...m, status } : m)),
      );
    };

    // ---------- CHAT SEEN ----------
    const onSeen = ({ chatId }) => {
      queryClient.setQueryData(["messages", chatId], (old = []) =>
        old.map((m) => ({ ...m, status: "seen" })),
      );
    };

    // ---------- TYPING ----------
    const onTyping = ({ chatId, userId }) => {
      useStates.getState().setTyping(chatId, userId, true);
    };

    const onStopTyping = ({ chatId, userId }) => {
      useStates.getState().setTyping(chatId, userId, false);
    };

    // ---------- DELETE ----------
    const onDeleted = ({ messageId }) => {
      queryClient.setQueryData(["messages", chatId], (old = []) =>
        old.filter((m) => m._id !== messageId),
      );
    };

    socket.on("newMessage", onNewMessage);
    socket.on("messageStatusUpdate", onStatus);
    socket.on("messagesSeen", onSeen);
    socket.on("typing", onTyping);
    socket.on("stop_typing", onStopTyping);
    socket.on("receiveDeletedMessage", onDeleted);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("messageStatusUpdate", onStatus);
      socket.off("messagesSeen", onSeen);
      socket.off("typing", onTyping);
      socket.off("stop_typing", onStopTyping);
      socket.off("receiveDeletedMessage", onDeleted);
    };
  }, [socket, authUser?._id, selectedUser]);

  return null;
}

// This all events are on this user show only which is actually deserve this functionality like typing so this is deserve the opponent user and status related all events deserve only authUser so i update this queries which is setQueryData so inside of this i update only deserving users messages array,
