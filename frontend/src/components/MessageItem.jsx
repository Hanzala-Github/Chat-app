// // ..........................................................................//
// import React, { useRef } from "react";
// import { ChevronDown, Smile } from "lucide-react";
// import { formatMessageTime } from "../lib/utils";
// import {
//   MessageHoverPopup,
//   MessageTicks,
//   VoiceMessagePlayer,
// } from "./component";
// import { useAuthStore } from "../store/useAuthStore";
// // import { useChatStore } from "../store/useChatStore";
// import { useStates } from "../store/useStates";
// import { useGetUsers } from "../hooks/useChatQueries";

// export const MessageItem = React.memo(function MessageItem({
//   message,
//   isLast,
//   lastRef,
// }) {
//   // console.log("MESSAGE_STATUS", message.status);
//   const hoverRef = useRef(false);
//   console.log("MessageItem component");
//   const authUser = useAuthStore((state) => state.authUser);
//   // const users = useChatStore((state) => state.users);
//   const { data: users } = useGetUsers();
//   // const selectedUser = useChatStore((state) => state.selectedUser);
//   const selectedUser = useStates((state) => state.selectedUser);
//   const setRightPopUp = useStates.getState().setRightPopUp;
//   const setStoreMessageId = useStates.getState().setStoreMessageId;
//   const setStoreMsgIdToSetDeleteMsgPopup =
//     useStates.getState().setStoreMsgIdToSetDeleteMsgPopup;
//   const setIsMessageHoverPopup = useStates.getState().setIsMessageHoverPopup;
//   const setPopupPosition = useStates.getState().setPopupPosition;
//   const setPopupPositionLeftRight =
//     useStates.getState().setPopupPositionLeftRight;
//   const storeMessageId = useStates((state) => state.storeMessageId);

//   const bubbleRef = useRef(null);
//   const hoverBtnRef = useRef(null);

//   const handleMouseEnter = (e) => {
//     e.stopPropagation();
//     hoverRef.current = true;
//     if (hoverBtnRef.current) {
//       hoverBtnRef.current.style.opacity = "1";
//       hoverBtnRef.current.style.transform = "scale(1)";
//       hoverBtnRef.current.style.width = "45px";
//       hoverBtnRef.current.style.pointerEvents = "auto";
//     }
//   };

//   const handleMouseLeave = (e) => {
//     e.stopPropagation();
//     hoverRef.current = false;
//     if (hoverBtnRef.current) {
//       hoverBtnRef.current.style.opacity = "0";
//       hoverBtnRef.current.style.transform = "scale(0.9)";
//       hoverBtnRef.current.style.width = "0px";
//       hoverBtnRef.current.style.pointerEvents = "none";
//     }
//   };

//   const handleMessageHoverPopup = (e) => {
//     e.stopPropagation();
//     setStoreMessageId(message._id); //thats create the issue of components re-render main is chatContainer
//     setStoreMsgIdToSetDeleteMsgPopup(message._id);
//     setIsMessageHoverPopup(true);
//     setRightPopUp(null);

//     const bubbleElement = bubbleRef.current;
//     if (!bubbleElement) return;

//     const rect = bubbleElement.getBoundingClientRect();
//     const elementCenterX = rect.left + rect.width / 2;
//     const isLeftHalf = elementCenterX < window.innerWidth / 2;
//     setPopupPositionLeftRight(isLeftHalf ? "right" : "left");

//     const elementCenterY = rect.top + rect.height / 2;
//     const isUpperHalf = elementCenterY < window.innerHeight / 2;
//     setPopupPosition(isUpperHalf ? "bottom" : "top");
//   };

//   return (
//     <div
//       className={`chat ${
//         message?.senderId === authUser?._id ? "chat-end" : "chat-start"
//       }`}
//       ref={isLast ? lastRef : null}
//     >
//       <div className="chat-image avatar">
//         <div className="size-10 rounded-full border-none">
//           <img
//             src={
//               message.receiverId === selectedUser
//                 ? authUser?.profilePic || "/avatar.png"
//                 : users?.find((user) => user?._id === selectedUser)
//                     ?.profilePic || "/avatar.png"
//             }
//             alt="profile pic"
//           />
//         </div>
//       </div>

//       <div className="chat-header mb-1">
//         <time className="text-xs opacity-50 ml-1 uppercase">
//           {formatMessageTime(message.createdAt)}
//         </time>
//       </div>

//       <div
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         className={`flex items-center justify-center gap-3 ${
//           message?.senderId === authUser?._id ? "flex-row-reverse" : "flex-row"
//         }`}
//       >
//         <div
//           ref={bubbleRef}
//           className={`max-w-[350px] w-full chat-bubble flex flex-col transition-all  ${
//             message.senderId === authUser?._id ? "bg-[#5251D4]" : "bg-gray-600"
//           }`}
//         >
//           {!!message.isReply && (
//             <div className="border-l-[#a4a4f0] border-l-[5px] rounded-[5px] flex items-center justify-between gap-2 w-[310px] my-2 py-2 px-2 bg-[#6767db7d]">
//               <span>
//                 <img
//                   className="w-[24px] h-[24px] rounded-full object-cover"
//                   src={
//                     message.replyTo?.receiverId === selectedUser
//                       ? authUser.profilePic
//                       : users.find(
//                           (user) => user._id === message.replyTo?.senderId
//                         )?.profilePic
//                   }
//                   alt=""
//                 />
//               </span>
//               <span className="text-[12px] flex-1 line-clamp-2 break-words">
//                 {message.replyTo?.text}
//               </span>
//               {!!message?.replyTo?.image && (
//                 <span>
//                   <img
//                     className="w-[40px] h-[35px] object-cover rounded-md"
//                     src={message.replyTo?.image}
//                     alt=""
//                   />
//                 </span>
//               )}
//             </div>
//           )}

//           {message.image && (
//             <img
//               src={message?.image}
//               alt="Attachment"
//               className="sm:max-w-[350px] rounded-md mb-2"
//             />
//           )}
//           {/*
//           <div className="flex justify-between w-full gap-4">
//             {message.text && (
//               <p className="leading-none text-[15px]">{message.text}</p>
//             )}
//           </div>
//            */}
//           {/* <div className="flex justify-between max-w-[350px] w-full gap-4">
//             {message.text && (
//               <p className="flex-1 text-[15px] leading-snug break-words whitespace-pre-wrap overflow-y-visible overflow-x-hidden flex gap-5">
//                 {message.text}
//                 {message.senderId === authUser?._id && (
//                   <MessageTicks status={message.status} />
//                 )}
//               </p>
//             )}
//           </div> */}

//           {/* <div className="max-w-[350px] w-full overflow-x-hidden overflow-y-auto">
//             <div className="flex gap-2 text-[15px] leading-snug relative justify-between">
//               <span className="flex-1 whitespace-pre-wrap break-all">
//                 {message.text}
//               </span>

//               {message.senderId === authUser?._id && (
//                 // inline-flex items-end
//                 <span className="absolute right-0 bottom-0">
//                   <MessageTicks status={message.status} />
//                 </span>
//               )}
//             </div>
//           </div> */}

//           {/* Voice */}
//           {message.type === "voice" && message.voice && (
//             <VoiceMessagePlayer
//               url={message.voice.url}
//               duration={message.voice.duration}
//               mimeType={message.voice.mimeType}
//               isSender={message.senderId === authUser?._id}
//               isReceiverOnline={!!message.receiverIsOnline}
//             />
//           )}

//           <div className="max-w-[350px] w-full overflow-x-hidden overflow-y-auto">
//             <div className="relative text-[14px] leading-snug w-full">
//               {/* Text block */}
//               <span className="block pr-5 whitespace-pre-wrap break-words">
//                 {message.text}
//               </span>

//               {/* Ticks – pinned bottom right */}
//               {message.senderId === authUser?._id && (
//                 <span className="absolute right-1 bottom-0">
//                   <MessageTicks status={message.status} />
//                 </span>
//               )}
//             </div>
//           </div>

//           {message?._id === storeMessageId && <MessageHoverPopup />}
//         </div>

//         {/* HOVER BUTTONS */}
//         <div
//           ref={hoverBtnRef}
//           onClick={handleMessageHoverPopup}
//           onBlur={() => setIsMessageHoverPopup(false)}
//           tabIndex={0}
//           className={`flex gap-1 w-[0px] h-6 p-1 bg-[#112] rounded-2xl px-[5px] items-center justify-center flex-row-reverse border border-[#a6a6a655] transition-all hover:bg-[#fbfafa00]`}
//           style={{
//             opacity: 0,
//             transform: "scale(0.9)",
//             pointerEvents: "none",
//             width: "0px",
//           }}
//         >
//           <button>
//             <Smile size={20} className="text-[#bab8b8]" />
//           </button>
//           <button>
//             <ChevronDown size={16} className="text-[#898686]" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// });
import React, { useRef } from "react";
import { ChevronDown, Smile } from "lucide-react";
import { formatMessageTime } from "../lib/utils";
import {
  MessageHoverPopup,
  MessageTicks,
  VoiceMessagePlayer,
} from "./component";
import { useAuthStore } from "../store/useAuthStore";
import { useStates } from "../store/useStates";
import { useGetUsers } from "../hooks/useChatQueries";

export const MessageItem = React.memo(function MessageItem({
  message,
  isLast,
  lastRef,
}) {
  const selectedUser = useStates((state) => state.selectedUser);
  const authUser = useAuthStore((state) => state.authUser);
  const { data: users = [] } = useGetUsers();

  const bubbleRef = useRef(null);
  const hoverBtnRef = useRef(null);

  const storeMessageId = useStates((state) => state.storeMessageId);

  const setRightPopUp = useStates.getState().setRightPopUp;
  const setStoreMessageId = useStates.getState().setStoreMessageId;
  const setStoreMsgIdToSetDeleteMsgPopup =
    useStates.getState().setStoreMsgIdToSetDeleteMsgPopup;
  const setIsMessageHoverPopup = useStates.getState().setIsMessageHoverPopup;
  const setPopupPosition = useStates.getState().setPopupPosition;
  const setPopupPositionLeftRight =
    useStates.getState().setPopupPositionLeftRight;

  const handleMessageHoverPopup = (e) => {
    e.stopPropagation();

    setStoreMessageId(message._id);
    setStoreMsgIdToSetDeleteMsgPopup(message._id);
    setIsMessageHoverPopup(true);
    setRightPopUp(null);

    const bubbleElement = bubbleRef.current;
    if (!bubbleElement) return;

    const rect = bubbleElement.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const isLeftHalf = elementCenterX < window.innerWidth / 2;
    setPopupPositionLeftRight(isLeftHalf ? "right" : "left");

    const elementCenterY = rect.top + rect.height / 2;
    const isUpperHalf = elementCenterY < window.innerHeight / 2;
    setPopupPosition(isUpperHalf ? "bottom" : "top");
  };

  const handleMouseEnter = () => {
    if (hoverBtnRef.current) {
      hoverBtnRef.current.style.opacity = "1";
      hoverBtnRef.current.style.transform = "scale(1)";
      hoverBtnRef.current.style.width = "45px";
      hoverBtnRef.current.style.pointerEvents = "auto";
    }
  };

  const handleMouseLeave = () => {
    if (hoverBtnRef.current) {
      hoverBtnRef.current.style.opacity = "0";
      hoverBtnRef.current.style.transform = "scale(0.9)";
      hoverBtnRef.current.style.width = "0px";
      hoverBtnRef.current.style.pointerEvents = "none";
    }
  };

  if (!message) return null;

  // return (
  //   <div
  //     className={`chat ${
  //       message.senderId === authUser?._id ? "chat-end" : "chat-start"
  //     }`}
  //     ref={isLast ? lastRef : null}
  //   >
  //     {/* Avatar */}
  //     <div className="chat-image avatar">
  //       <div className="size-10 rounded-full border-none">
  //         <img
  //           src={
  //             message.receiverId === selectedUser
  //               ? authUser?.profilePic || "/avatar.png"
  //               : users.find((u) => u?._id === selectedUser)?.profilePic ||
  //                 "/avatar.png"
  //           }
  //           alt="profile"
  //         />
  //       </div>
  //     </div>

  //     {/* Time */}
  //     <div className="chat-header mb-1">
  //       <time className="text-xs opacity-50 ml-1 uppercase">
  //         {formatMessageTime(message.createdAt)}
  //       </time>
  //     </div>

  //     {/* Bubble */}
  //     <div
  //       onMouseEnter={handleMouseEnter}
  //       onMouseLeave={handleMouseLeave}
  //       className={`flex gap-3 ${
  //         message.senderId === authUser?._id ? "flex-row-reverse" : "flex-row"
  //       }`}
  //     >
  //       <div
  //         ref={bubbleRef}
  //         className={`max-w-[350px] chat-bubble ${
  //           message.senderId === authUser?._id ? "bg-[#5251D4]" : "bg-gray-600"
  //         }`}
  //       >
  //         {/* Image */}
  //         {message.image && (
  //           <img src={message.image} className="rounded-md mb-2" />
  //         )}

  //         {/* Voice */}
  //         {message.type === "voice" && message.voice && (
  //           <VoiceMessagePlayer
  //             url={message.voice.url}
  //             duration={message.voice.duration}
  //             mimeType={message.voice.mimeType}
  //             isSender={message.senderId === authUser?._id}
  //             isReceiverOnline={!!message.receiverIsOnline}
  //           />
  //         )}

  //         {/* Text */}
  //         <div className="relative text-[14px] leading-snug w-full">
  //           <span className="block pr-5 whitespace-pre-wrap break-words">
  //             {message.text}
  //           </span>

  //           {message.senderId === authUser?._id && (
  //             <span className="absolute right-1 bottom-0">
  //               <MessageTicks status={message.status} />
  //             </span>
  //           )}
  //         </div>

  //         {/* Hover popup */}
  //         {message._id === storeMessageId && <MessageHoverPopup />}
  //       </div>

  //       {/* Hover buttons */}
  //       <div
  //         ref={hoverBtnRef}
  //         onClick={handleMessageHoverPopup}
  //         //  onBlur={() => setIsMessageHoverPopup(false)}
  //         tabIndex={0}
  //         className={`flex gap-1 w-[0px] h-6 p-1 bg-[#112] rounded-2xl px-[5px] items-center justify-center flex-row-reverse border border-[#a6a6a655] transition-all hover:bg-[#fbfafa00]`}
  //         style={{
  //           opacity: 0,
  //           transform: "scale(0.9)",
  //           pointerEvents: "none",
  //           width: "0px",
  //         }}
  //       >
  //         <button>
  //           <Smile size={20} className="text-[#bab8b8]" />
  //         </button>
  //         <button>
  //           <ChevronDown size={16} className="text-[#898686]" />
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div
      className={`chat ${
        message?.senderId === authUser?._id ? "chat-end" : "chat-start"
      }`}
      ref={isLast ? lastRef : null}
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center justify-center gap-3 ${
          message?.senderId === authUser?._id ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          ref={bubbleRef}
          className={`max-w-[350px] w-full chat-bubble flex flex-col transition-all  ${
            message.senderId === authUser?._id ? "bg-[#5251D4]" : "bg-gray-600"
          }`}
        >
          {!!message.isReply && (
            <div className="border-l-[#a4a4f0] border-l-[5px] rounded-[5px] flex items-center justify-between gap-2 w-[310px] my-2 py-2 px-2 bg-[#6767db7d]">
              <span>
                <img
                  className="w-[24px] h-[24px] rounded-full object-cover"
                  src={
                    message.replyTo?.receiverId === selectedUser
                      ? authUser.profilePic
                      : users.find(
                          (user) => user._id === message.replyTo?.senderId,
                        )?.profilePic
                  }
                  alt="img"
                />
              </span>
              <span className="text-[12px] flex-1 line-clamp-2 break-words">
                {message.replyTo?.text}
              </span>
              {!!message?.replyTo?.image && (
                <span>
                  <img
                    className="w-[40px] h-[35px] object-cover rounded-md"
                    src={message.replyTo?.image}
                    alt="img"
                  />
                </span>
              )}
            </div>
          )}

          {message.image && (
            <img
              src={message?.image}
              alt="Attachment"
              className="sm:max-w-[350px] rounded-md mb-2"
            />
          )}
          {/*
          <div className="flex justify-between w-full gap-4">
            {message.text && (
              <p className="leading-none text-[15px]">{message.text}</p>
            )}
          </div>
           */}
          {/* <div className="flex justify-between max-w-[350px] w-full gap-4">
            {message.text && (
              <p className="flex-1 text-[15px] leading-snug break-words whitespace-pre-wrap overflow-y-visible overflow-x-hidden flex gap-5">
                {message.text}
                {message.senderId === authUser?._id && (
                  <MessageTicks status={message.status} />
                )}
              </p>
            )}
          </div> */}

          {/* <div className="max-w-[350px] w-full overflow-x-hidden overflow-y-auto">
            <div className="flex gap-2 text-[15px] leading-snug relative justify-between">
              <span className="flex-1 whitespace-pre-wrap break-all">
                {message.text}
              </span>

              {message.senderId === authUser?._id && (
                // inline-flex items-end
                <span className="absolute right-0 bottom-0">
                  <MessageTicks status={message.status} />
                </span>
              )}
            </div>
          </div> */}

          {/* Voice */}
          {message.type === "voice" && message.voice && (
            <VoiceMessagePlayer
              url={message.voice.url}
              duration={message.voice.duration}
              mimeType={message.voice.mimeType}
              isSender={message.senderId === authUser?._id}
              isReceiverOnline={!!message.receiverIsOnline}
            />
          )}

          <div className="max-w-[350px] w-full overflow-x-hidden overflow-y-auto">
            <div className="relative text-[14px] leading-snug w-full">
              {/* Text block */}
              <span className="block pr-5 whitespace-pre-wrap break-words">
                {message.text}
              </span>

              {/* Ticks – pinned bottom right */}
              {message.senderId === authUser?._id && (
                <span className="absolute right-1 bottom-0">
                  <MessageTicks status={message.status} />
                </span>
              )}
            </div>
          </div>

          {message?._id === storeMessageId && <MessageHoverPopup />}
        </div>

        {/* HOVER BUTTONS */}
        <div
          ref={hoverBtnRef}
          onClick={handleMessageHoverPopup}
          onBlur={() => setIsMessageHoverPopup(false)}
          tabIndex={0}
          className={`flex gap-1 w-[0px] h-6 p-1 bg-[#112] rounded-2xl px-[5px] items-center justify-center flex-row-reverse border border-[#a6a6a655] transition-all hover:bg-[#fbfafa00]`}
          style={{
            opacity: 0,
            transform: "scale(0.9)",
            pointerEvents: "none",
            width: "0px",
          }}
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
  );
});
