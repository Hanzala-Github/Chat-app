import { useChatStore } from "../store/useChatStore";
import React, { useEffect } from "react";
import {
  ChatHeader,
  MessageInput,
  MessageSkeleton,
  ChatBubble,
} from "./component";
import { useStates } from "../store/useStates";

const ChatContainer = ({
  handleClosePopup,
  //  setRightPopUp
}) => {
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { setRightPopUp } = useStates();
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
  console.log("Container");
  // ...............This is the jsx return part...........//
  return (
    <div
      onClick={(e) => handleClosePopup(e)}
      className="flex-1 flex flex-col overflow-auto"
    >
      <ChatHeader />
      <ChatBubble setRightPopUp={setRightPopUp} />
      <MessageInput />
    </div>
  );
};

export { ChatContainer };
