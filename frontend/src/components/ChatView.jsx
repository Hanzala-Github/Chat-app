// ...................................................//
import React from "react";
// import { useChatStore } from "../store/useChatStore";
import { ChatContainer, NoChatSelected } from "./component";
import { useStates } from "../store/useStates";

export const ChatView = React.memo(() => {
  // const selectedUser = useChatStore((state) => state.selectedUser);
  const selectedUser = useStates((state) => state.selectedUser);
  console.log("ChatView");
  return !selectedUser ? <NoChatSelected /> : <ChatContainer />;
});
