// import axios from "../lib/axios";
// import { toast } from "sonner";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import { useSocketStore } from "../store/useSocketStore";
// import { useRef } from "react";

// // .........checkAuth function...............//
// export function useCheckAuth() {
//   // const connectSocket = useSocketStore((S) => S.connectSocket);
//   const connectSocket = useSocketStore.getState().connectSocket;
//   const connectedOnce = useRef(false);

//   return useQuery({
//     queryKey: ["authUser"],
//     queryFn: async () => {
//       const res = await axios.get("/auth/check"); // will send cookies
//       return res?.data?.user ?? null;
//     },
//     retry: false,
//     refetchOnWindowFocus: false, // optional; turn back on later if you want
//     staleTime: 1000 * 60 * 5, // optional; avoid frequent re-renders

//     onSuccess: (user) => {
//       // Only attempt connect when we actually have a user
//       if (user && !connectedOnce.current) {
//         connectSocket(user);
//         connectedOnce.current = true;
//       }
//     },

//     onError: (err) => {
//       // Avoid spamming logs if server returns 401
//       const status = err?.response?.status;
//       if (status !== 401) {
//         console.error("[useCheckAuth] failed:", status, err?.message);
//       }
//     },
//   });
// }

// // ..............Signup Mutation...........//
// export function useSignup() {
//   const queryClient = useQueryClient();

//   const { connectSocket } = useSocketStore();

//   return useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.post("/auth/signup", data);
//       return res?.data?.user;
//     },
//     onSuccess: (user) => {
//       queryClient.setQueryData(["authUser"], user);
//       connectSocket(user);
//       toast.success("Account created successfully");
//     },
//     onError: (err) => {
//       toast.error("Error in signup: " + err.message);
//     },
//   });
// }

// // ............. Login Mutation.............//
// export function useLogin() {
//   const queryClient = useQueryClient();

//   const { connectSocket } = useSocketStore();

//   return useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.post("/auth/login", data);
//       localStorage.setItem("token", res?.data?.user?.token);
//       return res?.data?.user;
//     },
//     onSuccess: (user) => {
//       queryClient.setQueryData(["authUser"], user);
//       connectSocket(user);
//       toast.success("Logged in successfully");
//     },
//     onError: (err) => {
//       toast.error("Error in login: " + err.message);
//     },
//   });
// }

// // ............... Logout Mutation.............//
// export function useLogout() {
//   const queryClient = useQueryClient();

//   const { disconnectSocket } = useSocketStore();

//   return useMutation({
//     mutationFn: async () => {
//       await axios.post("/auth/logout");
//       return null;
//     },
//     onSuccess: () => {
//       queryClient.removeQueries(["authUser"]);
//       disconnectSocket();
//       toast.success("Logged out successfully");
//     },
//     onError: (err) => {
//       toast.error("Error in logout: " + err.message);
//     },
//   });
// }

// // .......... Update Profile Mutation................//
// export function useUpdateProfile() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data) => {
//       const res = await axios.put("/auth/update-profile", data);
//       return res?.data?.user;
//     },
//     onSuccess: (user) => {
//       queryClient.setQueryData(["authUser"], user);
//       toast.success("Profile updated successfully");
//     },
//     onError: (err) => {
//       toast.error("Error in update profile: " + err.message);
//     },
//   });
// }
