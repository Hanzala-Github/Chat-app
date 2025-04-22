import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messagesCache: {},
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  //   ..............getUsers function ...................//

  getUsers: async () => {
    set({ isUserLoading: true });

    try {
      const res = await axios.get("/message/users");
      set({ users: res?.data?.users });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  //   ................getMessages function.................//

  // getMessages: async (userId) => {
  //   const cachedMessages = get().messagesCache[userId];

  //   if (cachedMessages) {
  //     set({ messages: cachedMessages });
  //     return; // Return cached data, no API call
  //   }

  //   set({ isMessagesLoading: true });

  //   try {
  //     const res = await axios.get(`/message/${userId}`);
  //     set((state) => ({
  //       messages: res?.data?.messages,
  //       messagesCache: {
  //         ...state.messagesCache,
  //         [userId]: res?.data?.messages,
  //       }, // Store in cache
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   } finally {
  //     set({ isMessagesLoading: false });
  //   }
  // },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axios.get(`/message/${userId}`);
      set({
        messages: res?.data?.messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ..............sendMessage function..............//
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    console.log(messages);

    try {
      const res = await axios.post(
        `/message/send/${selectedUser}`,
        messageData
      );

      // console.log(res?.data?.data);
      set({ messages: [...messages, res?.data?.data] });
      // set((state) => ({ messages: [...state.messages, res?.data?.data] }));
    } catch (error) {
      toast.error(error);
    }
  },

  // .............deleteMessagesHistory function...............//
  deleteMessagesHistory: async (id) => {
    try {
      await axios.delete(`/message/delete-messages-history/${id}`);

      set((state) => ({
        messages: state.messages.filter(
          (msg) => msg.receiverId !== id && msg.senderId !== id
        ),
      }));
    } catch (error) {
      console.error("Error in deleteMessagesHistory function", error);
    }
  },
  // .............subscribeToMessages function...............//

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      set((state) => ({ messages: [...state.messages, newMessage] }));
    });
  },

  // .............unsubscribeFromMessages function...............//
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // ..........selectedUser...............//
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
