// import axios from "../lib/axios";
// import { toast } from "sonner";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";
// // import { useSocketStore } from "../store/useSocketStore";
// import { useAuthStore } from "../store/useAuthStore";

// //   ..............usegetUsers function ...................//

// export function useGetUsers() {
//   return useQuery({
//     queryKey: ["chatUsers"],
//     queryFn: async () => {
//       const res = await axios.get("/message/users");

//       return res?.data?.users || [];
//     },

//     staleTime: 1000 * 60 * 5, // cache for 5 minute
//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Error fetching users");
//     },
//   });
// }

// // ................Get Messages...................//

// export function useGetMessages(userId) {
//   return useQuery({
//     queryKey: ["messages", userId],
//     queryFn: async () => {
//       const res = await axios.get(`/message/${userId}`);
//       return res?.data?.messages || [];
//     },
//     enabled: !!userId, // only fetch if userId exists
//     staleTime: 0,
//     onError: (error) => {
//       console.error("Error fetching messages : ", error);
//     },
//   });
// }

// // ...............Send Message.......................//

// export function useSendMessage(selectedUser) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (messageData) => {
//       const res = await axios.post(
//         `/message/send/${selectedUser}`,
//         messageData
//       );

//       return res?.data?.data;
//     },

//     // this newMessage is come on this above return like in above this i return this : return res?.data?.data , so this is actually updatedMessage or newMessage on
//     //so i see anyone value or parameter i get inside of this onSuccess so this is actually above return value

//     onSuccess: (newMessage) => {
//       queryClient.setQueryData(["messages", selectedUser], (old = []) => [
//         ...old,
//         newMessage,
//       ]);
//     },

//     onError: (error) => {
//       toast.error(error?.response?.data?.message || "Error sending message");
//     },
//   });
// }

// // ...............Delete Message History.................//

// export function useDeleteMessagesHistory() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id) => {
//       const authUser = queryClient.getQueryData(["authUser"]);
//       const myId = authUser?._id;

//       await axios.delete(`message/delete-messages-history/${id}`);
//       return { id, myId };
//     },

//     onSuccess: ({ id, myId }) => {
//       queryClient.setQueryData(["messages", id], (old = []) =>
//         old.filter(
//           (msg) =>
//             msg.receiverId !== id &&
//             msg.senderId !== id &&
//             !msg.deletedBy.includes(myId)
//         )
//       );
//     },

//     onError: (error) => {
//       console.error("Error in deleteMessagesHistory function : ", error);
//     },
//   });
// }

// // -----------------Delete Message By Id -------------------//

// export function useDeleteMessageById(userId) {
//   const queryClient = useQueryClient();

//   return (messageId) => {
//     queryClient.setQueryData(["messages", userId], (old = []) =>
//       old.filter((msg) => msg._id !== messageId)
//     );
//   };
// }

// // ---------------- DELETE MESSAGE FOR ME ---------------- //
// export function useDeleteMessageForMe() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (messageId) => {
//       const authUser = queryClient.getQueryData(["authUser"]);
//       const myId = authUser?._id;

//       await axios.delete(`/message/delete-message-forme/${messageId}`);
//       return { messageId, myId };
//     },
//     // onSuccess: ({ messageId, myId }) => {
//     //   queryClient.invalidateQueries(["messages"], (old = []) =>
//     //     old.filter(
//     //       (msg) => msg._id !== messageId && !msg.deletedBy.includes(myId)
//     //     )
//     //   );
//     // },

//     onSuccess: () => {
//       queryClient.invalidateQueries(["messages"]);
//     },
//   });
// }

// // ---------------- DELETE MESSAGE FOR EVERYONE ---------------- //
// export function useDeleteMessageForEveryone(receiverId) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (messageId) => {
//       await axios.delete(`/message/delete-message-foreveryone/${messageId}`);
//       // const socket = useSocketStore.getState().socket;
//       const socket = useAuthStore.getState().socket;
//       socket.emit("deleteMessageForEveryone", { messageId, receiverId });
//       return messageId;
//     },
//     onSuccess: (messageId) => {
//       queryClient.setQueryData(["messages", receiverId], (old = []) =>
//         old.filter((msg) => msg._id !== messageId)
//       );
//     },
//     onError: (error) => {
//       console.error("Error in deleteMessageForEveryOne function : ", error);
//     },
//   });
// }

// // ---------------- SUBSCRIBE TO SOCKET MESSAGES ---------------- //
// export function useSubscribeToMessages(userId) {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     if (!userId) return;

//     // const socket = useSocketStore.getState().socket;
//     const socket = useAuthStore.getState().socket;

//     const handler = (newMessage) => {
//       queryClient.setQueryData(
//         ["messages", userId],
//         // ["messages", newMessage?.senderId, newMessage.receiverId],
//         (old = []) => [...old, newMessage]
//       );
//     };

//     socket.on("newMessage", handler);

//     return () => {
//       socket.off("newMessage", handler);
//     };
//   }, [userId, queryClient]);
// }

import axios from "../lib/axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { getChatId } from "../lib/utils";
// import { useStates } from "../store/useStates";

// -------------------- useGetUsers -------------------- //
export function useGetUsers() {
  return useQuery({
    queryKey: ["chatUsers"],
    queryFn: async () => {
      const res = await axios.get("/message/users");
      return res?.data?.users || [];
    },
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error fetching users");
    },
  });
}

// -------------------- useGetMessages -------------------- //
export function useGetMessages(selectedUserId) {
  const authUser = useAuthStore((s) => s.authUser);
  const chatId = getChatId(authUser._id, selectedUserId);

  return useQuery({
    // queryKey: ["messages", authUser?._id, selectedUserId],
    queryKey: ["messages", chatId],

    queryFn: async () => {
      const res = await axios.get(`/message/${selectedUserId}`);
      return res?.data?.messages || [];
    },
    enabled: !!authUser?._id && !!selectedUserId,
    onError: (error) => {
      console.error("Error fetching messages:", error);
    },
  });
}

// -------------------- useSendMessage -------------------- //
export function useSendMessage(selectedUserId) {
  const authUser = useAuthStore((s) => s.authUser);
  const chatId = getChatId(authUser._id, selectedUserId);
  // const socket = useAuthStore((state) => state.socket);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData) => {
      console.log("SSSSSSSEEEEEEEEEEEEEEEENNNNNNNNNNDDDDDDDD", messageData);
      const res = await axios.post(
        `/message/send/${selectedUserId}`,
        messageData
      );
      // return res?.data?.data;
      return res?.data;
    },

    onSuccess: (newMessage) => {
      // console.log(
      //   "newMessagenewMessagenewMessagenewMessagenewMessagenewMessage",
      //   newMessage.receiverIsOnline
      // );

      if (!newMessage.receiverIsOnline) {
        queryClient.setQueryData(["messages", chatId], (old = []) => [
          ...old,
          newMessage?.data,
          // newMessage,
        ]);
      }
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error sending message");
    },
  });
}

// -------------------- useDeleteMessagesHistory -------------------- //
export function useDeleteMessagesHistory() {
  const authUser = useAuthStore((s) => s.authUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/message/delete-messages-history/${id}`);
      return id;
    },

    onSuccess: (id) => {
      const chatId = getChatId(authUser._id, id);

      // queryClient.setQueryData(["messages", authUser?._id, id], []);
      queryClient.setQueryData(["messages", chatId], []);
    },
  });
}

// -------------------- useDeleteMessageById -------------------- //
export function useDeleteMessageById(selectedUserId) {
  const authUser = useAuthStore((s) => s.authUser);
  const chatId = getChatId(authUser._id, selectedUserId);

  const queryClient = useQueryClient();

  return (messageId) => {
    queryClient.setQueryData(
      // ["messages", authUser?._id, selectedUserId],
      ["messages", chatId],
      (old = []) => old.filter((msg) => msg._id !== messageId)
    );
  };
}

// -------------------- useDeleteMessageForMe -------------------- //
export function useDeleteMessageForMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId) => {
      await axios.delete(`/message/delete-message-forme/${messageId}`);
      return messageId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });
}

// -------------------- useDeleteMessageForEveryone -------------------- //
export function useDeleteMessageForEveryone(selectedUserId) {
  const queryClient = useQueryClient();
  const socket = useAuthStore.getState().socket;
  const authUser = useAuthStore((state) => state.authUser);
  const chatId = getChatId(authUser._id, selectedUserId);

  return useMutation({
    mutationFn: async (messageId) => {
      await axios.delete(`/message/delete-message-foreveryone/${messageId}`);
      socket.emit("deleteMessageForEveryone", {
        messageId,
        receiverId: selectedUserId,
      });
      return messageId;
    },
    onSuccess: (messageId) => {
      queryClient.setQueryData(
        // ["messages", authUser?._id, selectedUserId],
        ["messages", chatId],
        (old = []) => old.filter((msg) => msg._id !== messageId)
      );
    },
  });
}

// -------------------- useSubscribeToMessages -------------------- //
export function useSubscribeToMessages(selectedUserId) {
  const authUser = useAuthStore((s) => s.authUser);
  console.log("PPPPPPPPPPPPPPPPPPPP", authUser._id);
  console.log("OOOOOOOOOOOOOOOOOOOOOOOO", selectedUserId);
  // const selectedUser = useStates((state) => state.selectedUser);
  const chatId = getChatId(authUser._id, selectedUserId);
  const socket = useAuthStore((s) => s.socket);
  const queryClient = useQueryClient();

  useEffect(() => {
    // if (!socket || !authUser?._id || !selectedUserId) return;
    if (!socket || !authUser?._id) return;

    const handler = (newMessage) => {
      // only update if this message belongs to this chat
      const isBetween =
        (newMessage.senderId === authUser._id &&
          newMessage.receiverId === selectedUserId) ||
        (newMessage.senderId === selectedUserId &&
          newMessage.receiverId === authUser._id);

      if (!isBetween) return;

      queryClient.setQueryData(["messages", chatId], (old = []) => [
        ...old,
        newMessage,
      ]);
    };

    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, selectedUserId, authUser, queryClient]);
}
