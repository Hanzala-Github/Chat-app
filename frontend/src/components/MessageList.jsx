// components/MessageList.jsx
import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { MessageItem } from "./MessageItem";

export const MessageList = React.memo(function MessageList({ setRightPopUp }) {
  const messages = useChatStore((state) => state.messages);
  const messageEndRef = useRef(null);

  // scroll into view when messages change (kept behavior)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages]);
  console.log("Message List component");

  return (
    <>
      {messages?.map((message, index) => (
        <MessageItem
          key={message?._id}
          message={message}
          setRightPopUp={setRightPopUp}
          isLast={index === messages.length - 1}
          lastRef={messageEndRef}
        />
      ))}
    </>
  );
});
