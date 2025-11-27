import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useStates } from "../store/useStates";
import { getChatId } from "../lib/utils";

export const useJoinChatRoom = () => {
  const socket = useAuthStore((s) => s.socket);
  const selectedUser = useStates((s) => s.selectedUser);
  const authUser = useAuthStore((s) => s.authUser);
  useEffect(() => {
    if (!socket || !authUser || !selectedUser) return;

    const chatId = getChatId(authUser?._id, selectedUser);

    // ✅ Join chat room
    socket.emit("join_chat", chatId);

    // ✅ Optional: leave old chat when switching
    return () => socket.emit("leave_chat", chatId);
  }, [socket, authUser, selectedUser]);
};
