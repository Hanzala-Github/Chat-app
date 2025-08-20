import { useChatStore } from "../store/useChatStore";
import React, { useEffect } from "react";
// import { shallow } from "zustand/shallow";
import {
  ChatHeader,
  MessageSkeleton,
  ChatBubble,
  MessageInput,
} from "./component";
import { useStates } from "../store/useStates";
import { useFunctions } from "../hooks/useFunctions";

// ............chatContainer component..............//
const ChatContainer = () => {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const isMessagesLoading = useChatStore((state) => state.isMessagesLoading);
  const getMessages = useChatStore.getState().getMessages;
  const subscribeToMessages = useChatStore.getState().subscribeToMessages;
  const unsubscribeFromMessages =
    useChatStore.getState().unsubscribeFromMessages;
  const rightPopUp = useStates((state) => state.rightPopUp);
  const storeMessageId = useStates((state) => state.storeMessageId);
  const { handleClosePopup } = useFunctions();
  useEffect(() => {
    if (!selectedUser) return;
    getMessages(selectedUser);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  const handleOuterClick = (e) => {
    if (e.target.closest(".popup-content")) return;
    handleClosePopup(e);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  console.log("Container");
  // ...............This is the jsx return part...........//
  return (
    <div
      onClick={(rightPopUp || storeMessageId) && handleOuterClick}
      className="flex-1 flex flex-col overflow-auto"
    >
      <ChatHeader />
      <ChatBubble />
      <MessageInput />
    </div>
  );
};

export { ChatContainer };
