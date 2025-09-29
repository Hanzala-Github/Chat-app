// ................................................................//

// import { useChatStore } from "../store/useChatStore";
// import React, { useEffect } from "react";
import React from "react";
import {
  ChatHeader,
  MessageSkeleton,
  ChatBubble,
  MessageInput,
} from "./component";
import { useStates } from "../store/useStates";
import { useFunctions } from "../hooks/useFunctions";
import {
  useGetMessages,
  useSubscribeToMessages,
} from "../hooks/useChatQueries";

// ............chatContainer component..............//
const ChatContainer = () => {
  // const selectedUser = useChatStore((state) => state.selectedUser);
  const selectedUser = useStates((state) => state.selectedUser);

  // const isMessagesLoading = useChatStore((state) => state.isMessagesLoading);
  // const getMessages = useChatStore.getState().getMessages;

  const { isLoading: isMessagesLoading } = useGetMessages(selectedUser);

  // const subscribeToMessages = useChatStore.getState().subscribeToMessages;
  // const unsubscribeFromMessages =
  //   useChatStore.getState().unsubscribeFromMessages;

  // const rightPopUp = useStates((state) => state.rightPopUp);
  // const storeMessageId = useStates((state) => state.storeMessageId);
  const { handleClosePopup } = useFunctions();

  useSubscribeToMessages(selectedUser);

  // useEffect(() => {
  //   if (!selectedUser) return;
  //   getMessages(selectedUser);
  //   subscribeToMessages();
  //   return () => unsubscribeFromMessages();
  // }, [selectedUser]);

  // const handleOuterClick = (e) => {
  //   if (e.target.closest(".popup-content")) return;
  //   console.log("HANDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDddd");
  //   handleClosePopup(e);
  // };

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
      // onClick={(rightPopUp || storeMessageId) && handleOuterClick}
      onClick={(e) => handleClosePopup(e)}
      className="flex-1 flex flex-col overflow-auto"
    >
      <ChatHeader />
      <ChatBubble />
      <MessageInput />
    </div>
  );
};

export { ChatContainer };
