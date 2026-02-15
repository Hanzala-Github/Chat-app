// // ..........................................................//
// // components/MessageList.jsx
// import React, { useEffect, useRef } from "react";
// // import { useChatStore } from "../store/useChatStore";
// import { MessageItem } from "./MessageItem";
// import { useGetMessages } from "../hooks/useChatQueries";
// import { useStates } from "../store/useStates";
// // import { useAuthStore } from "../store/useAuthStore";

// export const MessageList = React.memo(function MessageList() {
//   console.log("MESSAGE LIST COMPONENT");
//   // const messages = useChatStore((state) => state.messages);
//   const selectedUser = useStates((state) => state.selectedUser);
//   // const authUser = useAuthStore((state) => state.authUser);

//   const { data: messages = [] } = useGetMessages(selectedUser);
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (messageEndRef.current) {
//         messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//       }
//     }, 50);
//     return () => clearTimeout(timeout);
//   }, [messages]);

//   return (
//     <>
//       {messages?.map((message, index) => (
//         <MessageItem
//           key={message?._id}
//           message={message}
//           isLast={index === messages.length - 1}
//           lastRef={messageEndRef}
//         />
//       ))}
//     </>
//   );
// });
//------222222222222---------------//
// import React, { useEffect, useRef } from "react";
// import { useGetMessages } from "../hooks/useChatQueries";
// import { useStates } from "../store/useStates";
// import { useAuthStore } from "../store/useAuthStore";
// import { getChatId } from "../lib/utils";
// import { MessageItem } from "./MessageItem";

// export const MessageList = React.memo(function MessageList() {
//   const selectedUser = useStates((s) => s.selectedUser);
//   const authUser = useAuthStore((s) => s.authUser);

//   const chatId =
//     authUser && selectedUser ? getChatId(authUser._id, selectedUser) : null;

//   const { data: messages = [], isLoading } = useGetMessages(selectedUser);

//   const messageEndRef = useRef(null);

//   // Auto scroll to bottom
//   useEffect(() => {
//     const t = setTimeout(() => {
//       messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 50);
//     return () => clearTimeout(t);
//   }, [messages.length]);

//   if (!chatId) return null;
//   if (isLoading)
//     return <div className="text-center opacity-60">Loading...</div>;

//   return (
//     <>
//       {messages.map((msg, index) => (
//         <MessageItem
//           key={msg._id}
//           message={msg}
//           isLast={index === messages.length - 1}
//           lastRef={messageEndRef}
//         />
//       ))}
//     </>
//   );
// });

// -------------------------//
// MessageList.jsx
import React, { useEffect, useRef } from "react";
import { useGetMessages } from "../hooks/useChatQueries";
import { useStates } from "../store/useStates";
import { MessageItem } from "./MessageItem";

export const MessageList = React.memo(function MessageList() {
  const selectedUser = useStates((s) => s.selectedUser);
  const { data: messages = [] } = useGetMessages(selectedUser);
  console.log("MessageList component");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="space-y-4">
      {messages.map((m, i) => (
        <MessageItem
          key={m._id}
          message={m}
          isLast={i === messages.length - 1}
          lastRef={endRef}
        />
      ))}
    </div>
  );
});
