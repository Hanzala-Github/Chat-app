// ..............................................................//
import React, { useEffect, useState } from "react";
import { MessageDeletePopup, MessageList } from "./component";
import { useAuthStore } from "../store/useAuthStore";
// import { useQueryClient } from "@tanstack/react-query";
// import { useChatStore } from "../store/useChatStore";
import { useStates } from "../store/useStates";
import {
  useDeleteMessageById,
  useDeleteMessageForEveryone,
  useDeleteMessageForMe,
  useGetMessages,
} from "../hooks/useChatQueries";
import { getChatId } from "../lib/utils";
import { useQueryClient } from "@tanstack/react-query";
// import { MessageList } from "./MessageList";
export const ChatBubble = React.memo(function ChatBubble() {
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [isDeleteForEveryOne, setIsDeleteForEveryOne] = useState(false);

  const selectedUser = useStates((state) => state.selectedUser);
  const authUser = useAuthStore((state) => state.authUser);
  const { data: messages = [] } = useGetMessages(selectedUser);

  console.log(messages);

  const storeMsgIdToSetDeleteMsgPopup = useStates(
    (state) => state.storeMsgIdToSetDeleteMsgPopup
  );
  const showDeletePopup = useStates((state) => state.showDeletePopup);
  const setText = useStates.getState().setText;
  const drafts = useStates((state) => state.drafts);
  const clearDraft = useStates.getState().clearDraft;

  const setShowDeletePopup = useStates.getState().setShowDeletePopup;

  const deleteMessageForMe = useDeleteMessageForMe();

  const deleteMessageForEveryOne = useDeleteMessageForEveryone(selectedUser);

  const deleteMessageById = useDeleteMessageById(selectedUser);

  const socket = useAuthStore((state) => state.socket);
  const queryClient = useQueryClient();

  console.log("S_S_S_S_S_S_S_S_S_S_S_S_S_S_S__S_S_S_S_S__S_S_", socket);
  console.log(socket.connected);
  console.log(socket.id);
  console.log(messages);
  console.log("ChatBubble re-render");
  useEffect(() => {
    if (!socket.connected || !socket.id || !selectedUser) return;

    const chatId = getChatId(authUser._id, selectedUser);
    let lastEmitTime = 0;
    const EMIT_INTERVAL = 2000; // throttle to avoid spam

    const emitSeen = () => {
      const now = Date.now();
      if (now - lastEmitTime >= EMIT_INTERVAL) {
        socket.emit("markMessagesAsSeen", { chatId, userId: authUser._id });
        lastEmitTime = now;
      }
    };

    // ✅ 1. Run immediately when chat opens
    emitSeen();

    socket.on("newMessage", (message) => {
      if (message.senderId === selectedUser && message.chatId === chatId) {
        emitSeen();
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket.connected, socket.id, selectedUser]);

  // useEffect(() => {
  //   if (!socket) return;

  //   const handleMessageStatusUpdate = ({ chatId, userId }) => {
  //     if (!chatId || !userId) return;

  //     queryClient.setQueryData(["messages", chatId]);
  //   };

  //   socket.on("messagesDelivered", handleMessageStatusUpdate);

  //   return () => socket.off("messagesDelivered");
  // }, [socket]);

  // useEffect(() => {
  //   if (!selectedUser || !authUser || !socket) return;

  //   const chatId = getChatId(authUser._id, selectedUser);
  //   let lastEmitTime = 0;
  //   const EMIT_INTERVAL = 3000; // 3 seconds throttle

  //   // ✅ Step 1: Emit once immediately when chat page opens
  //   console.log("✅ Initial markMessagesAsSeen emitted");
  //   socket.emit("markMessagesAsSeen", {
  //     chatId,
  //     userId: authUser._id,
  //   });
  //   lastEmitTime = Date.now();

  //   // ✅ Step 2: Setup event listeners for real-time activity
  //   const emitUserActive = () => {
  //     const now = Date.now();
  //     if (now - lastEmitTime >= EMIT_INTERVAL) {
  //       console.log("🟢 User active — markMessagesAsSeen emitted");
  //       socket.emit("markMessagesAsSeen", {
  //         chatId,
  //         userId: authUser._id,
  //       });
  //       lastEmitTime = now;
  //     }
  //   };

  //   // Add listeners
  //   window.addEventListener("mousemove", emitUserActive);
  //   window.addEventListener("keydown", emitUserActive);
  //   window.addEventListener("focus", emitUserActive);
  //   document.addEventListener("visibilitychange", () => {
  //     if (document.visibilityState === "visible") emitUserActive();
  //   });

  //   // Cleanup
  //   return () => {
  //     window.removeEventListener("mousemove", emitUserActive);
  //     window.removeEventListener("keydown", emitUserActive);
  //     window.removeEventListener("focus", emitUserActive);
  //     document.removeEventListener("visibilitychange", emitUserActive);
  //   };
  // }, [selectedUser, authUser, socket]);

  // useEffect(() => {

  //   const draft = drafts[authUser?._id]?.[selectedUser];

  //   if (draft) {
  //     setText(draft);

  //     // ❗ Remove from sidebar (WhatsApp behavior)
  //     clearDraft(authUser?._id, selectedUser);
  //   } else {
  //     setText("");
  //   }
  // }, [selectedUser]);

  useEffect(() => {
    if (!authUser?._id || !selectedUser) return;

    // Always generate consistent chatId
    const chatId = getChatId(authUser._id, selectedUser);

    const draft = drafts[authUser._id]?.[chatId] || "";

    if (draft.trim()) {
      setText(draft);

      // Remove from sidebar (WhatsApp behavior)
      clearDraft(authUser._id, chatId);
    } else {
      setText("");
    }
  }, [selectedUser]);

  useEffect(() => {
    const onDelete = ({ messageId }) => {
      deleteMessageById(messageId);
    };

    if (!socket) return;
    socket.on("receiveDeletedMessage", onDelete);

    return () => {
      socket.off("receiveDeletedMessage", onDelete);
    };
  }, [socket, deleteMessageById]);

  useEffect(() => {
    if (!socket) return; // ⛔ don't attach if socket not ready

    const handleTyping = ({ chatId, userId }) => {
      console.log("These are typing Ids :", { chatId, userId });
      useStates.getState().setTyping(chatId, userId, true);
    };

    const handleStopTyping = ({ chatId, userId }) => {
      console.log({ chatId, userId });
      useStates.getState().setTyping(chatId, userId, false);
    };

    // ✅ Attach listeners
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    // ✅ Cleanup on unmount or when socket changes
    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket]);

  // useEffect(() => {
  //   if (!authUser || !selectedUser || !socket) return;

  //   // --------------- Receive new message --------------- //
  //   const handleReceiveMessage = (message) => {
  //     const chatId = getChatId(message.senderId, message.receiverId);

  //     queryClient.setQueryData(["messages", chatId], (old = []) => {
  //       if (old.some((m) => m._id === message._id)) return old;
  //       return [...old, message];
  //     });

  //     // addMessageToChat(chatId, message);
  //   };

  //   // --------------- Update single message status --------------- //
  //   const handleMessageStatusUpdate = ({ chatId, messageId, status }) => {
  //     if (!chatId || !messageId || !status) return;

  //     queryClient.setQueryData(["messages", chatId], (old = []) =>
  //       old.map((m) => (m._id === messageId ? { ...m, status } : m))
  //     );

  //     // updateMessageStatus(chatId, messageId, status);
  //   };

  //   // --------------- Mark entire chat as seen --------------- //
  //   const handleMessagesSeen = ({ chatId }) => {
  //     if (!chatId) return;

  //     queryClient.setQueryData(["messages", chatId], (old = []) =>
  //       old.map((m) => ({ ...m, status: "seen" }))
  //     );

  //     // markChatAsSeen(chatId);
  //   };

  //   socket.on("receiveMessage", handleReceiveMessage);
  //   socket.on("messageStatusUpdate", handleMessageStatusUpdate);
  //   socket.on("messagesSeen", handleMessagesSeen);

  //   return () => {
  //     socket.off("receiveMessage", handleReceiveMessage);
  //     socket.off("messageStatusUpdate", handleMessageStatusUpdate);
  //     socket.off("messagesSeen", handleMessagesSeen);
  //   };
  // }, [authUser, socket, selectedUser]);

  // --------------- Auto-emit seen status when chat opened --------------- //
  // useEffect(() => {
  //   if (!selectedUser || !authUser || !socket) return;
  //   const chatId = getChatId(authUser._id, selectedUser);

  //   socket.emit("markMessagesAsSeen", {
  //     chatId,
  //     userId: authUser._id,
  //   });
  // }, [selectedUser, authUser, socket]);

  // ChatBubble.jsx
  useEffect(() => {
    if (!authUser || !selectedUser || !socket) return;
    const chatId = getChatId(authUser._id, selectedUser);

    // ✅ New message arrives
    const handleReceiveMessage = (message) => {
      const msgChatId = getChatId(message.senderId, message.receiverId);

      // if (message.senderId === authUser._id) return;

      // store it locally
      // queryClient.setQueryData(["messages", msgChatId], (old = []) => {
      //   if (old.some((m) => m._id === message._id)) return old;
      //   return [...old, message];
      // });

      // 🟢 Instantly emit "delivered" if receiver is viewing the same chat
      if (msgChatId === chatId && message.receiverId === selectedUser) {
        socket.emit("markMessageDelivered", {
          chatId,
          messageId: message._id,
          receiverId: selectedUser,
        });
        console.log("✅ Delivered instantly emitted");
      }
    };

    // ✅ Single-message status update
    const handleMessageStatusUpdate = ({ chatId, messageId, status }) => {
      queryClient.setQueryData(["messages", chatId], (old = []) =>
        old.map((m) => (m._id === messageId ? { ...m, status } : m))
      );
    };

    // ✅ Entire chat seen
    const handleMessagesSeen = ({ chatId }) => {
      queryClient.setQueryData(["messages", chatId], (old = []) =>
        old.map((m) => ({ ...m, status: "seen" }))
      );
    };

    socket.on("newMessage", handleReceiveMessage);
    // socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageStatusUpdate", handleMessageStatusUpdate);
    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("newMessage", handleReceiveMessage);
      // socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageStatusUpdate", handleMessageStatusUpdate);
      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [authUser, socket, selectedUser]);

  const findMsg =
    messages.filter((msg) => msg._id === storeMsgIdToSetDeleteMsgPopup)[0]
      ?.senderId === authUser?._id;

  const findformeMsg =
    messages.filter((msg) => msg._id === storeMsgIdToSetDeleteMsgPopup)[0]
      ?.senderId !== authUser?._id;

  const radioClass = `appearance-none w-4 h-4 rounded-full scale-[1.4] border border-gray-500
  ${
    deleteMessage
      ? "checked:bg-[#0e0e0f] checked:border-red-400 checked:border-4"
      : "checked:bg-[#232325] checked:border-gray-500"
  }`;

  const handleDeleteForMe = (e) => {
    e.stopPropagation();
    setShowDeletePopup(false);
    deleteMessageForMe.mutate(storeMsgIdToSetDeleteMsgPopup);
  };

  const handleDeleteForMeOrEveryOne = (e) => {
    e.stopPropagation();
    setShowDeletePopup(false);
    // deleteMessageForEveryOne(storeMsgIdToSetDeleteMsgPopup, selectedUser);
    deleteMessageForEveryOne.mutate(storeMsgIdToSetDeleteMsgPopup);
  };

  console.log("ChatBubble component");

  // the wrapper: delete popup (kept) + the message list component
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
      {/* MessageDeletePopup component (unchanged behavior) */}
      {findMsg
        ? showDeletePopup && (
            <MessageDeletePopup
              deletedData={
                <div className="space-y-3">
                  <label className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      onChange={() => {
                        setDeleteMessage(true);
                        setIsDeleteForEveryOne(false);
                      }}
                      name="Delete"
                      className={radioClass}
                    />
                    <p className="text-[14px]">Delete for me</p>
                  </label>
                  <label className="flex items-center gap-2.5">
                    <input
                      onChange={() => {
                        setDeleteMessage(true);
                        setIsDeleteForEveryOne(true);
                      }}
                      type="radio"
                      name="Delete"
                      className={radioClass}
                    />
                    <p className="text-[14px]">Delete for everyone</p>
                  </label>
                </div>
              }
              deleteBtn={
                <button
                  onClick={
                    findMsg && isDeleteForEveryOne
                      ? handleDeleteForMeOrEveryOne
                      : handleDeleteForMe
                  }
                  type="button"
                  className={`flex-1 ${
                    deleteMessage ? "bg-red-400" : "bg-[#3b3b3c]"
                  } rounded-[6px] py-[7px] text-[13px] ${
                    deleteMessage && "text-black"
                  }`}
                >
                  Delete
                </button>
              }
              MsgText="You can delete messages for everyone or just for yourself."
            />
          )
        : showDeletePopup && (
            <MessageDeletePopup
              deleteBtn={
                <button
                  onClick={findformeMsg && handleDeleteForMe}
                  type="button"
                  className={`flex-1 bg-red-400 
                   rounded-[6px] py-[7px] text-[13px] text-black`}
                >
                  Delete for me
                </button>
              }
              MsgText="This has no effect on your recipients' chat."
            />
          )}

      {/* MessageList: contains the scroll effect + message mapping */}
      {/* <MessageList setRightPopUp={setRightPopUp} /> */}
      <MessageList />
    </div>
  );
});
