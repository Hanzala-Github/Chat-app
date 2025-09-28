// // .........................................................................//
// import { create } from "zustand";
// import axios from "../lib/axios";
// import { toast } from "sonner";
// import { useAuthStore } from "./useAuthStore";

// let newMessageHandler = null;

// export const useChatStore = create((set, get) => ({
//   messagesCache: {},
//   messages: [],
//   users: [],
//   selectedUser: null,
//   isUserLoading: false,
//   isMessagesLoading: false,
//   //   ..............getUsers function ...................//

//   getUsers: async () => {
//     set({ isUserLoading: true });

//     try {
//       const res = await axios.get("/message/users");
//       set({ users: res?.data?.users });
//     } catch (error) {
//       console.log("getUsers error : ", error);
//       toast.error(error?.response?.data?.message || "getUsers failed");
//     } finally {
//       set({ isUserLoading: false });
//     }
//   },

//   //................getMessages function.................//

//   getMessages: async (userId) => {
//     set({ isMessagesLoading: true });

//     try {
//       const res = await axios.get(`/message/${userId}`);
//       set({
//         messages: res?.data?.messages,
//       });
//     } catch (error) {
//       console.log("getMessages error : ", error);
//       toast.error(error?.response?.data?.message || "getMessages failed");
//     } finally {
//       set({ isMessagesLoading: false });
//     }
//   },

//   // ..............sendMessage function..............//
//   sendMessage: async (messageData) => {
//     const { selectedUser, messages } = get();
//     try {
//       const res = await axios.post(
//         `/message/send/${selectedUser}`,
//         messageData
//       );

//       set({ messages: [...messages, res?.data?.data] });
//     } catch (error) {
//       console.log("sendMessage error : ", error);
//       toast.error(error?.response?.data?.message || "sendMessage failed");
//     }
//   },

//   // .............deleteMessagesHistory function...............//
//   deleteMessagesHistory: async (id) => {
//     try {
//       await axios.delete(`/message/delete-messages-history/${id}`);
//       const myId = useAuthStore.getState().authUser?._id;
//       set((state) => ({
//         messages: state.messages.filter(
//           (msg) =>
//             msg.receiverId !== id &&
//             msg.senderId !== id &&
//             !msg.deletedBy.includes(myId)
//         ),
//       }));
//     } catch (error) {
//       console.log("deleteMessagesHistory error : ", error);
//       toast.error(
//         error?.response?.data?.message || "deleteMessagesHistory failed"
//       );
//     }
//   },

//   // ..........deleteMessageById............//
//   deleteMessageById: (messageId) =>
//     set((state) => ({
//       messages: state.messages.filter((msg) => msg._id !== messageId),
//     })),

//   // .............deleteMessageForMe...........//
//   deleteMessageForMe: async (messageId) => {
//     const myId = useAuthStore.getState().authUser?._id;

//     set((state) => ({
//       messages: state.messages.filter(
//         (msg) => msg._id !== messageId && !msg.deletedBy.includes(myId)
//       ),
//     }));
//     await axios.delete(`/message/delete-message-forme/${messageId}`);
//   },

//   // .........deleteMessageForEveryOne...........//

//   deleteMessageForEveryOne: async (messageId, receiverId) => {
//     useChatStore.getState().deleteMessageById(messageId);

//     const socket = useAuthStore.getState().socket;

//     try {
//       await axios.delete(`/message/delete-message-foreveryone/${messageId}`);

//       socket.emit("deleteMessageForEveryone", {
//         messageId,
//         receiverId,
//       });
//     } catch (error) {
//       console.log("deleteMessageForEveryOne error : ", error);
//       toast.error(
//         error.response?.data?.message || "deleteMessageForEveryOne failed"
//       );
//     }
//   },

//   // .............subscribeToMessages function...............//

//   subscribeToMessages: () => {
//     const { selectedUser } = get();
//     if (!selectedUser) return;

//     const socket = useAuthStore.getState().socket;

//     if (newMessageHandler) {
//       socket.off("newMessage", newMessageHandler);
//     }

//     newMessageHandler = (newMessage) => {
//       set((state) => ({ messages: [...state.messages, newMessage] }));
//     };

//     socket.on("newMessage", newMessageHandler);
//   },

//   // .............unsubscribeFromMessages function...............//
//   unsubscribeFromMessages: () => {
//     const socket = useAuthStore.getState().socket;

//     if (newMessageHandler) {
//       socket.off("newMessage", newMessageHandler);
//       newMessageHandler = null;
//     }
//   },

//   // ..........selectedUser...............//
//   setSelectedUser: (selectedUser) => set({ selectedUser }),
// }));
