import { useChatStore } from "../store/useChatStore";
import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import {
  ChatHeader,
  MessageInput,
  MessageSkeleton,
  ChatBubble,
} from "./component";
import { useStates } from "../store/useStates";
import { useFunctions } from "../hooks/useFunctions";
const ChatContainer = () => {
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore(
    (state) => ({
      getMessages: state.getMessages,
      isMessagesLoading: state.isMessagesLoading,
      selectedUser: state.selectedUser,
      subscribeToMessages: state.subscribeToMessages,
      unsubscribeFromMessages: state.unsubscribeFromMessages,
    }),
    shallow
  );
  const { setRightPopUp, rightPopUp, storeMessageId } = useStates();
  const { handleClosePopup } = useFunctions();
  useEffect(() => {
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
      <ChatBubble setRightPopUp={setRightPopUp} />
      <MessageInput />
    </div>
  );
};

export { ChatContainer };
