import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  //   .............checkAuth function..............//

  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/check");
      set({ authUser: res?.data?.user });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  //   ............signup function..............//
  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axios.post("/auth/signup", data);
      set({ authUser: res?.data?.user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("error in signup function in useAuthStore", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ..............login function...............//

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post("/auth/login", data);
      localStorage.setItem("token", res?.data?.user?.token); // Store token
      set({ authUser: res?.data?.user });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Error in Login function", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  // ..........logout function.........//
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error in logout function", error);
    }
  },

  // .......updateProfile function............//
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axios.put("/auth/update-profile", data);
      set({ authUser: res?.data?.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile : ", error);
      toast.error("Error in updateProfile function", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ........connectSocket function...................//

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser) return;

    if (get().socket) {
      get().socket.disconnect();
    }

    const socket = io(BASE_URL, {
      query: {
        userId: authUser?._id,
      },
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // ........disconnectSocket function...................//
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
