// import React, { useEffect, useRef, useState } from "react";
// import { ChevronDown, Smile } from "lucide-react";
// import { formatMessageTime } from "../lib/utils";
// import { SidebarRightClickPopup } from "./SidebarRightClickPopup";
// import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";
// import { useStates } from "../store/useStates";

// export function ChatBubble({ setRightPopUp }) {
//   const [openMessagePopup, setOpenMessagePopup] = useState(null);
//   const [storeMessageId, setstoreMessageId] = useState(null);
//   const { users, messages, selectedUser } = useChatStore();
//   const { authUser } = useAuthStore();
//   const {
//     setIsMessageHoverPopup,
//     isMessageHoverPopup,
//     setPopupPosition,
//     setPopupPositionLeftRight,
//   } = useStates();

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
//     setIsMessageHoverPopup(true);
//     setstoreMessageId(messageId);
//     setRightPopUp(null);

//     const rect = e.target.getBoundingClientRect();
//     const isLeftHalf = rect.left < window.innerWidth / 2;
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
//               {message.image && (
//                 <img
//                   src={message?.image}
//                   alt="Attachment"
//                   className="sm:max-w-[200px] rounded-md mb-2"
//                 />
//               )}
//               {message.text && <p>{message.text}</p>}

//               {isMessageHoverPopup && message?._id === storeMessageId && (
//                 <SidebarRightClickPopup messageId={message?._id} />
//               )}
//             </div>

//             <div
//               onClick={(e) => handleMessageHoverPopup(e, message?._id)}
//               onBlur={() => setIsMessageHoverPopup(false)}
//               className={`flex gap-1 w-[0px] h-7 bg-[#112] rounded-2xl p-1 px-[5px] items-center justify-between flex-row-reverse border border-[#f1efef55] transition-all ${
//                 openMessagePopup === message?._id
//                   ? "opacity-100 scale-100 w-[50px]"
//                   : "opacity-0 scale-90 pointer-events-none w-[0px]"
//               }`}
//             >
//               <button>
//                 <Smile size={20} className="text-[#bab8b8]" />
//               </button>
//               <button>
//                 <ChevronDown size={16} className="text-[#bab8b8]" />
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Smile } from "lucide-react";
import { formatMessageTime } from "../lib/utils";
import { SidebarRightClickPopup } from "./SidebarRightClickPopup";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useStates } from "../store/useStates";

export function ChatBubble({ setRightPopUp }) {
  const openMessagePopupRef = useRef(null); // FIXED: replaced useState with useRef
  const [storeMessageId, setstoreMessageId] = useState(null);
  const { users, messages, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const {
    setIsMessageHoverPopup,
    isMessageHoverPopup,
    setPopupPosition,
    setPopupPositionLeftRight,
  } = useStates();

  const messageEndRef = useRef(null);
  console.log(messages[0]);

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
    console.log("Helloin");
    openMessagePopupRef.current = message?._id; // FIXED: update ref instead of state
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation();
    console.log("HelloOut");
    openMessagePopupRef.current = null; // FIXED: reset ref
  };

  const handleMessageHoverPopup = (e, messageId) => {
    e.stopPropagation();
    setIsMessageHoverPopup(true);
    setstoreMessageId(messageId);
    setRightPopUp(null);

    const rect = e.target.getBoundingClientRect();
    const isLeftHalf = rect.left < window.innerWidth / 2;
    setPopupPositionLeftRight(isLeftHalf ? "right" : "left");
    const isUpperHalf = rect.top < window.innerHeight / 2;
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
              onClick={console.log("Hello i am the main DIVVVVVVVVVVVvv")}
              className={`max-w-[350px] chat-bubble flex flex-col overflow-y-visible break-words whitespace-pre-wrap  transition-all ${
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
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}

              {isMessageHoverPopup && message?._id === storeMessageId && (
                <SidebarRightClickPopup messageId={message?._id} />
              )}
            </div>

            <div
              onClick={(e) => handleMessageHoverPopup(e, message?._id)}
              onBlur={() => setIsMessageHoverPopup(false)}
              className={`flex gap-1 w-[0px] h-7 bg-[#112] rounded-2xl p-1 px-[5px] items-center justify-between flex-row-reverse border border-[#f1efef55] transition-all ${
                openMessagePopupRef.current === message?._id // FIXED: replaced state check with ref
                  ? "opacity-100 scale-100 w-[50px]"
                  : "opacity-0 scale-90 pointer-events-none w-[0px]"
              }`}
            >
              <button>
                <Smile size={20} className="text-[#bab8b8]" />
              </button>
              <button>
                <ChevronDown size={16} className="text-[#bab8b8]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
