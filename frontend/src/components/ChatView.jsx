import React from "react";
import { useChatStore } from "../store/useChatStore";
import { ChatContainer, NoChatSelected } from "./component";

export const ChatView = React.memo(() => {
  const selectedUser = useChatStore((state) => state.selectedUser);

  return !selectedUser ? <NoChatSelected /> : <ChatContainer />;
});
