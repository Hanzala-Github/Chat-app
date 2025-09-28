// // src/hooks/useSocketStore.js
// import { create } from "zustand";
// import { io } from "socket.io-client";

// const BASE_URL = "http://localhost:5000";

// export const useSocketStore = create((set, get) => ({
//   socket: null,
//   onlineUsers: [],
//   connectedUserId: null, // track who we connected as

//   connectSocket: (authUser) => {
//     if (!authUser?._id) return;

//     const { socket, connectedUserId } = get();

//     // ✅ already connected for this user -> do nothing
//     if (socket?.connected && connectedUserId === authUser._id) return;

//     // ✅ if different user / stale socket -> close old one
//     if (socket) socket.disconnect();

//     const s = io(BASE_URL, {
//       query: { userId: authUser._id },
//       transports: ["websocket"], // often reduces noisy reconnects
//     });

//     // Only one set() call to avoid extra renders
//     set({ socket: s, connectedUserId: authUser._id });

//     s.on("getOnlineUsers", (userIds) => {
//       // Only update if changed to reduce renders
//       const prev = get().onlineUsers;
//       const sameLength = prev.length === userIds.length;
//       const same = sameLength && prev.every((id, i) => id === userIds[i]);
//       if (!same) set({ onlineUsers: userIds });
//     });

//     s.on("disconnect", () => {
//       // Keep connectedUserId; only clear socket
//       set({ socket: null });
//     });
//   },

//   disconnectSocket: () => {
//     const s = get().socket;
//     if (s) s.disconnect();
//     set({ socket: null, onlineUsers: [] });
//   },
// }));
