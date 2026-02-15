import React from "react";
import { useStates } from "../store/useStates";
import { useAuthStore } from "../store/useAuthStore";
import { getChatId } from "../lib/utils";

export const TypingIndicator = React.memo(function TypingIndicator() {
  //     {
  //   selectedUser,
  // }
  const authUser = useAuthStore((s) => s.authUser);
  const selectedUser = useStates((state) => state.selectedUser);

  const chatId = getChatId(authUser?._id, selectedUser);
  console.log("TypingIndicator");
  // ✅ Subscribe ONLY to this chat typing state
  const isOtherUserTyping = useStates((state) => {
    const typingUserId = state.typingUsers[chatId];
    return typingUserId && typingUserId !== authUser?._id;
  });

  if (!isOtherUserTyping) return "Online";

  return <span className="text-green-400">typing...</span>;
  //   return isOtherUserTyping ? (
  //     <span className="text-green-400">typing...</span>
  //   ) : (
  //     "Online"
  //   );
});
