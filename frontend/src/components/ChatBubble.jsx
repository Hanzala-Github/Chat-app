// import React, { useEffect, useRef, useState } from "react";
// import { ChevronDown, Smile } from "lucide-react";
// import { formatMessageTime } from "../lib/utils";
// import { MessageHoverPopup } from "./component";

// import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";
// import { useStates } from "../store/useStates";

// export const ChatBubble = React.memo(function ChatBubble({ setRightPopUp }) {
//   const [openMessagePopup, setOpenMessagePopup] = useState(null);

//   const users = useChatStore((state) => state.users);
//   const messages = useChatStore((state) => state.messages);
//   const selectedUser = useChatStore((state) => state.selectedUser);
//   const authUser = useAuthStore((state) => state.authUser);
//   const storeMessageId = useStates((state) => state.storeMessageId);
//   const setIsMessageHoverPopup = useStates.getState().setIsMessageHoverPopup;
//   const setPopupPosition = useStates.getState().setPopupPosition;
//   const setPopupPositionLeftRight =
//     useStates.getState().setPopupPositionLeftRight;
//   const setStoreMessageId = useStates.getState().setStoreMessageId;

//   const messageEndRef = useRef(null);
//   console.log(messages[0]);
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       if (messageEndRef.current) {
//         messageEndRef.current.scrollIntoView({ behavior: "smooth" });
//       }
//     }, 50);
//     return () => clearTimeout(timeout);
//   }, [messages]);

//   const handleMouseEnter = (e, message) => {
//     e.stopPropagation();
//     console.log("HOVERIN");
//     setOpenMessagePopup(message?._id);
//   };

//   const handleMouseLeave = (e) => {
//     e.stopPropagation();
//     console.log("HOVEROut");
//     setOpenMessagePopup(null);
//   };

//   const handleMessageHoverPopup = (e, messageId) => {
//     e.stopPropagation();
//     console.log("cheakatakboom");
//     setStoreMessageId(messageId);
//     setIsMessageHoverPopup(true);
//     setRightPopUp(null);

//     const rect = e.currentTarget.getBoundingClientRect();
//     console.log(rect);
//     const elementCenterX = rect.left + rect.width / 2;
//     const isLeftHalf = elementCenterX < window.innerWidth / 2;
//     setPopupPositionLeftRight(isLeftHalf ? "right" : "left");
//     const isUpperHalf = rect.top < window.innerHeight / 2;
//     setPopupPosition(isUpperHalf ? "bottom" : "top");
//   };

//   // ................This is the jsx return part................//
//   return (
//     <div className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
//       {messages?.map((message, index) => (
//         <div
//           key={message?._id}
//           className={`chat ${
//             message?.senderId === authUser?._id ? "chat-end" : "chat-start"
//           }`}
//           ref={index === messages.length - 1 ? messageEndRef : null}
//         >
//           <div className="chat-image avatar">
//             <div className="size-10 rounded-full border-none">
//               <img
//                 src={
//                   message.receiverId === selectedUser
//                     ? authUser?.profilePic || "/avatar.png"
//                     : users?.find((user) => user?._id === selectedUser)
//                         ?.profilePic || "/avatar.png"
//                 }
//                 alt="profile pic"
//               />
//             </div>
//           </div>
//           <div className="chat-header mb-1">
//             <time className="text-xs opacity-50 ml-1 uppercase">
//               {formatMessageTime(message.createdAt)}
//             </time>
//           </div>
//           <div
//             onMouseEnter={(e) => handleMouseEnter(e, message)}
//             onMouseLeave={handleMouseLeave}
//             className={`flex items-center justify-center gap-3 ${
//               message?.senderId === authUser?._id
//                 ? "flex-row-reverse"
//                 : "flex-row"
//             }`}
//           >
//             <div
//               className={`max-w-[350px] chat-bubble flex flex-col overflow-y-visible break-words whitespace-pre-wrap  transition-all ${
//                 message.senderId === authUser?._id
//                   ? "bg-[#5251D4]"
//                   : "bg-gray-600"
//               }`}
//               style={{ transition: "all 0.8s" }}
//             >
//               {/* {console.log(message)} */}
//               {message.image && (
//                 <img
//                   src={message?.image}
//                   alt="Attachment"
//                   className="sm:max-w-[200px] md:w-[350px] rounded-md mb-2"
//                 />
//               )}
//               {message.text && <p className="leading-none">{message.text}</p>}

//               {message?._id === storeMessageId && <MessageHoverPopup />}
//             </div>

//             <div
//               onClick={(e) => handleMessageHoverPopup(e, message?._id)}
//               onBlur={() => setIsMessageHoverPopup(false)}
//               className={`flex gap-1 w-[0px] h-6 p-1 bg-[#112] rounded-2xl px-[5px] items-center justify-center flex-row-reverse border border-[#a6a6a655] transition-all hover:bg-[#fbfafa00] ${
//                 openMessagePopup === message?._id
//                   ? "opacity-100 scale-100 w-[45px]"
//                   : "opacity-0 scale-90 pointer-events-none w-[0px]"
//               }`}
//             >
//               <button>
//                 <Smile size={20} className="text-[#bab8b8]" />
//               </button>
//               <button>
//                 <ChevronDown size={16} className="text-[#898686]" />
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// });
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Smile } from "lucide-react";
import { formatMessageTime } from "../lib/utils";
import { MessageHoverPopup } from "./component";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useStates } from "../store/useStates";

export const ChatBubble = React.memo(function ChatBubble({ setRightPopUp }) {
  const [openMessagePopup, setOpenMessagePopup] = useState(null);

  const users = useChatStore((state) => state.users);
  const messages = useChatStore((state) => state.messages);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const authUser = useAuthStore((state) => state.authUser);
  const storeMessageId = useStates((state) => state.storeMessageId);
  const setIsMessageHoverPopup = useStates.getState().setIsMessageHoverPopup;
  const setPopupPosition = useStates.getState().setPopupPosition;
  const setPopupPositionLeftRight =
    useStates.getState().setPopupPositionLeftRight;
  const setStoreMessageId = useStates.getState().setStoreMessageId;

  const messageEndRef = useRef(null);
  const bubbleRefs = useRef({});

  console.log("ChatBubble re-render");

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleMouseEnter = (e, message) => {
    e.stopPropagation();
    setOpenMessagePopup(message?._id);
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation();
    setOpenMessagePopup(null);
  };

  const handleMessageHoverPopup = (e, messageId) => {
    e.stopPropagation();
    setStoreMessageId(messageId);
    setIsMessageHoverPopup(true);
    setRightPopUp(null);

    const bubbleElement = bubbleRefs.current[messageId];
    if (!bubbleElement) return;

    const rect = bubbleElement.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const isLeftHalf = elementCenterX < window.innerWidth / 2;
    setPopupPositionLeftRight(isLeftHalf ? "right" : "left");

    const elementCenterY = rect.top + rect.height / 2;
    const isUpperHalf = elementCenterY < window.innerHeight / 2;
    setPopupPosition(isUpperHalf ? "bottom" : "top");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
      {messages?.map((message, index) => (
        <div
          key={message?._id}
          className={`chat ${
            message?.senderId === authUser?._id ? "chat-end" : "chat-start"
          }`}
          ref={index === messages.length - 1 ? messageEndRef : null}
        >
          <div className="chat-image avatar">
            <div className="size-10 rounded-full border-none">
              <img
                src={
                  message.receiverId === selectedUser
                    ? authUser?.profilePic || "/avatar.png"
                    : users?.find((user) => user?._id === selectedUser)
                        ?.profilePic || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1 uppercase">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>
          <div
            onMouseEnter={(e) => handleMouseEnter(e, message)}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center justify-center gap-3 ${
              message?.senderId === authUser?._id
                ? "flex-row-reverse"
                : "flex-row"
            }`}
          >
            <div
              ref={(el) => (bubbleRefs.current[message._id] = el)}
              className={`max-w-[350px]  chat-bubble flex flex-col overflow-y-visible break-words whitespace-pre-wrap transition-all ${
                message.senderId === authUser?._id
                  ? "bg-[#5251D4]"
                  : "bg-gray-600"
              }`}
              style={{ transition: "all 0.8s" }}
            >
              {message.image && (
                <img
                  src={message?.image}
                  alt="Attachment"
                  className="sm:max-w-[350px]  rounded-md mb-2"
                />
              )}
              {message.text && <p className="leading-none">{message.text}</p>}

              {message?._id === storeMessageId && <MessageHoverPopup />}
            </div>

            <div
              onClick={(e) => handleMessageHoverPopup(e, message?._id)}
              onBlur={() => setIsMessageHoverPopup(false)}
              className={`flex gap-1 w-[0px] h-6 p-1 bg-[#112] rounded-2xl px-[5px] items-center justify-center flex-row-reverse border border-[#a6a6a655] transition-all hover:bg-[#fbfafa00] ${
                openMessagePopup === message?._id
                  ? "opacity-100 scale-100 w-[45px]"
                  : "opacity-0 scale-90 pointer-events-none w-[0px]"
              }`}
            >
              <button>
                <Smile size={20} className="text-[#bab8b8]" />
              </button>
              <button>
                <ChevronDown size={16} className="text-[#898686]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
