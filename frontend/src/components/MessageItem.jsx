// components/MessageItem.jsx
import React, { useState, useRef } from "react";
import { Check, ChevronDown, Smile } from "lucide-react";
import { formatMessageTime } from "../lib/utils";
import { MessageHoverPopup } from "./component";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useStates } from "../store/useStates";

export const MessageItem = React.memo(function MessageItem({
  message,
  setRightPopUp,
  isLast,
  lastRef,
}) {
  const [openMessagePopup, setOpenMessagePopup] = useState(null);

  const authUser = useAuthStore((state) => state.authUser);
  const users = useChatStore((state) => state.users);
  const selectedUser = useChatStore((state) => state.selectedUser);

  const setStoreMessageId = useStates.getState().setStoreMessageId;
  const setStoreMsgIdToSetDeleteMsgPopup =
    useStates.getState().setStoreMsgIdToSetDeleteMsgPopup;
  const setIsMessageHoverPopup = useStates.getState().setIsMessageHoverPopup;
  const setPopupPosition = useStates.getState().setPopupPosition;
  const setPopupPositionLeftRight =
    useStates.getState().setPopupPositionLeftRight;
  const storeMessageId = useStates((state) => state.storeMessageId);

  const bubbleRef = useRef(null);

  // mouse handlers (copied exactly)
  const handleMouseEnter = (e) => {
    e.stopPropagation();
    setOpenMessagePopup(message?._id);
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation();
    setOpenMessagePopup(null);
  };

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

  console.log("MessageItem component");

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
        onMouseEnter={(e) => handleMouseEnter(e)}
        onMouseLeave={handleMouseLeave}
        className={`flex items-center justify-center gap-3 ${
          message?.senderId === authUser?._id ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          ref={bubbleRef}
          className={`max-w-[350px] w-full  chat-bubble flex flex-col overflow-y-visible break-words whitespace-pre-wrap transition-all ${
            message.senderId === authUser?._id ? "bg-[#5251D4]" : "bg-gray-600"
          }`}
          style={{ transition: "all 0.8s" }}
        >
          {/* Reply UI (copied exactly) */}
          {!!message.isReply && (
            <div className="border-l-[#a4a4f0] border-l-[5px] rounded-[5px] flex items-center justify-between gap-2 w-full my-2 py-2 px-2 bg-[#6767db7d]">
              <span className="">
                <img
                  className="w-8 h-6 rounded-full object-cover "
                  src={
                    message.replyTo?.receiverId === selectedUser
                      ? authUser.profilePic
                      : users.find(
                          (user) => user._id === message.replyTo?.senderId
                        )?.profilePic
                  }
                  alt=""
                />
              </span>

              <span className="text-[12px] w-full line-clamp-2 break-words">
                {message.replyTo?.text}
              </span>

              {!!message?.replyTo?.image && (
                <span>
                  <img
                    className="w-[60px] h-[46px] object-cover rounded-md"
                    src={message.replyTo?.image}
                    alt=""
                  />
                </span>
              )}
            </div>
          )}

          {/* Message image (copied exactly) */}
          {message.image && (
            <img
              src={message?.image}
              alt="Attachment"
              className="sm:max-w-[350px]  rounded-md mb-2"
            />
          )}

          <div className="flex justify-between w-full gap-4">
            {message.text && (
              <p className="leading-none text-[15px]">{message.text}</p>
            )}

            {/* isMessageSeen commented code preserved */}
            {/*
            {message?.senderId === authUser?._id && (
              <span className="text-[12px] mt-1">
                {isMessageSeen[message?._id] === true ? (
                  <span className="flex flex-col items-center justify-center text-green-400">
                    <Check size={12} /> <Check size={12} />
                  </span>
                ) : (
                  <span className="text-gray-300">
                    <Check size={12} />
                  </span>
                )}
              </span>
            )}
            */}
          </div>

          {message?._id === storeMessageId && <MessageHoverPopup />}
        </div>

        <div
          onClick={(e) => handleMessageHoverPopup(e)}
          onBlur={() => setIsMessageHoverPopup(false)}
          tabIndex={0}
          className={`flex gap-1 w-[0px] h-6 p-1 bg-[#112] rounded-2xl px-[5px] items-center justify-center flex-row-reverse border border-[#a6a6a655] transition-all hover:bg-[#fbfafa00] ${
            openMessagePopup === message?._id
              ? "opacity-100 scale-100 w-[45px]"
              : "opacity-0 scale-90 pointer-events-none w-[0px]"
          } `}
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
