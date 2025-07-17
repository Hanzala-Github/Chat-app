import React from "react";
import { X } from "lucide-react";
import { useStates } from "../store/useStates";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

export function ReplyChat() {
  const authUser = useAuthStore((state) => state.authUser);
  const users = useChatStore((state) => state.users);
  // const messages = useChatStore((state) => state.messages);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setIsReplyChatOpen = useStates.getState().setIsReplyChatOpen;
  const singleMessageReply = useStates((state) => state.singleMessageReply);
  console.log(singleMessageReply);

  // ...............This is the jsx return part.............//
  return (
    <div className="max-w-[88%] w-full h-14 flex justify-between items-center gap-3 pl-3 bg-[#4A5565] rounded-md shadow-sm border-l-[#7BA2D2] border-l-[5px] border-t-[#d4d4d4] border-t-[1px] overflow-hidden">
      {/* Left side: User avatar */}
      <div className="flex items-center justify-center w-[88%] gap-2">
        <img
          //       message.receiverId === selectedUser
          // ? authUser?.profilePic || "/avatar.png"
          // : users?.find((user) => user?._id === selectedUser)?.profilePic ||
          //   "/avatar.png"
          // src={
          //   authUser.profilePic ||
          //   "https://plus.unsplash.com/premium_photo-1744805464532-998bee603eae?q=80&w=1974"
          // }
          src={
            singleMessageReply[0].receiverId === selectedUser
              ? authUser.profilePic
              : users.find(
                  (user) => user._id === singleMessageReply[0].senderId
                )?.profilePic
          }
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover"
        />
        <p className="text-[12px] w-full line-clamp-2 break-words">
          {singleMessageReply[0]?.text}
        </p>
      </div>

      {/* Right side: Reply image + Close button */}
      <div className="flex items-center justify-end  h-full w-[12%]">
        {/* Reply image (square) */}
        <img
          src={
            singleMessageReply[0]?.image ||
            "https://plus.unsplash.com/premium_photo-1744805464532-998bee603eae?q=80&w=1974"
          }
          alt="reply"
          className="w-[50px] h-[90%] object-cover rounded-md"
        />

        {/* Close button */}
        <span
          onClick={() => setIsReplyChatOpen(false)}
          className="w-full h-full hover:bg-[#576272] flex items-center justify-center"
        >
          <X size={15} className="border rounded-full" />
        </span>
      </div>
    </div>
  );
}
