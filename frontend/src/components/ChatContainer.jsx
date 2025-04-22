import { useChatStore } from "../store/useChatStore";
import React, { useEffect } from "react";
import {
  ChatHeader,
  MessageInput,
  MessageSkeleton,
  ChatBubble,
} from "./component";

const ChatContainer = ({ handleClosePopup, setRightPopUp }) => {
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  useEffect(() => {
    getMessages(selectedUser);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  // ...............This is the jsx return part...........//
  return (
    <div
      onClick={handleClosePopup}
      className="flex-1 flex flex-col overflow-auto"
    >
      <ChatHeader />
      <ChatBubble setRightPopUp={setRightPopUp} />
      <MessageInput />
    </div>
  );
};

export { ChatContainer };
