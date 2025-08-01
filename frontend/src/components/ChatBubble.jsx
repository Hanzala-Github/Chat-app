import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Smile } from "lucide-react";
import { formatMessageTime } from "../lib/utils";
import { MessageDeletePopup, MessageHoverPopup } from "./component";

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

  const showDeletePopup = useStates((state) => state.showDeletePopup);

  const messageEndRef = useRef(null);
  const bubbleRefs = useRef({});

  console.log(messages);
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
  const findMsg =
    messages.filter((msg) => msg._id === storeMessageId)[0]?.senderId ===
    authUser?._id;
  console.log(findMsg);
  // deletepopup.................//
  const [deleteMessage, setDeleteMessage] = useState(false);
  const radioClass = `appearance-none w-4 h-4 rounded-full scale-[1.4] border border-gray-500
  ${
    deleteMessage
      ? "checked:bg-[#0e0e0f] checked:border-red-400 checked:border-4"
      : "checked:bg-[#232325] checked:border-gray-500"
  }`;
  // ................This is the jsx return part.................//
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
      {findMsg
        ? showDeletePopup && (
            <MessageDeletePopup
              deletedData={
                <div className="space-y-3">
                  <label className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      onChange={() => setDeleteMessage(true)}
                      name="Delete"
                      className={radioClass}
                    />

                    <p className="text-[14px]">Delete for me</p>
                  </label>
                  <label className="flex items-center gap-2.5">
                    <input
                      onChange={() => setDeleteMessage(true)}
                      type="radio"
                      name="Delete"
                      className={radioClass}
                    />
                    <p className="text-[14px]">Delete for everyone</p>
                  </label>
                </div>
              }
              deleteBtntext="Delete"
              MsgText="You can delete messages for everyone or just for yourself."
              deleteMessage={deleteMessage}
            />
          )
        : showDeletePopup && (
            <MessageDeletePopup
              deleteBtntext="Delete for me"
              MsgText="This has no effect on your recipients' chat."
              deleteMessage={deleteMessage}
            />
          )}

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

                  {!!message.replyTo.image && (
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

              {message.image && (
                <img
                  src={message?.image}
                  alt="Attachment"
                  className="sm:max-w-[350px]  rounded-md mb-2"
                />
              )}
              {message.text && (
                <p className="leading-none text-[15px]">{message.text}</p>
              )}

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
