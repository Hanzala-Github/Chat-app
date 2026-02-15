import React, { useRef } from "react";
import { motion } from "framer-motion";
import Picker from "emoji-picker-react";
import {
  Ban,
  Copy,
  Heart,
  Plus,
  Reply,
  Save,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useStates } from "../store/useStates";
import { useFunctions } from "../hooks/useFunctions";

export function SidebarRightClickPopup({
  // handleDeleteMessagesHis,
  handleSelectUser,
  // messageId,
}) {
  const {
    popupPosition,
    isShowCloseChat,
    isMessageHoverPopup,
    popupPositionLeftRight,
    setIsReplyChatOpen,
    isReplyChatOpen,
    // storeMessageId,
  } = useStates();

  const { handleDeleteMessagesHis } = useFunctions();
  const clickRef = useRef(false);
  const handleReplyPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (clickRef.current) return; // debounce
    clickRef.current = true;
    console.log("Replyyyyyyyyyy");
    setIsReplyChatOpen(true);
    setTimeout(() => {
      clickRef.current = false;
    }, 200);
  };
  console.log(isReplyChatOpen);

  // if (storeMessageId !== messageId) return null;
  // ..............This is the jsx return part...............//

  return isMessageHoverPopup ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`popup-content absolute z-50 bg-[#0d0e10] shadow-lg rounded-lg  w-40 p-2 space-y-2 text-sm 
          ${popupPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"}  ${
            popupPositionLeftRight === "left" ? "right-[50%]" : "left-[50%]"
          }`}
    >
      <button
        onClick={handleReplyPopup}
        className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]"
      >
        <Reply size={16} /> Reply
      </button>
      <button className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]">
        <Copy size={16} /> Copy
      </button>
      <button className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]">
        <Save size={16} /> Save as
      </button>
      <div className="flex justify-between items-center">
        <span className="rounded-full text-[20px] cursor-pointer">👍</span>

        <span className="rounded-full  text-[20px]">😂</span>
        <span className="rounded-full  text-[20px]">😢</span>
        <span className="rounded-full  text-[20px]">❤️</span>
        <span className="rounded-full  border border-[#cfcfcf33] flex items-center justify-center p-[2px]">
          <Plus className="size-4 text-gray-300" />
        </span>
      </div>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`popup-content absolute z-50 bg-[#0d0e10] shadow-lg rounded-lg w-40 p-2 space-y-2 text-sm 
          ${popupPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"} `}
      style={{ left: `30%` }}
    >
      {isShowCloseChat && (
        <button
          onClick={(e) => handleDeleteMessagesHis(e)}
          className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]"
        >
          <XCircle size={16} /> Clear Messages
        </button>
      )}

      <button className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]">
        <Heart size={16} /> Add to favorites
      </button>
      <button className="flex items-center gap-2 w-full px-2 py-1 text-red-500 hover:bg-[#22262d] rounded-[5px]">
        <Ban size={16} /> Block User
      </button>
      <button className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]">
        <Trash2 size={16} /> Delete
      </button>
      {isShowCloseChat && (
        <button
          onClick={(e) => handleSelectUser(e)}
          className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]"
        >
          <X size={16} /> Close chat
        </button>
      )}
    </motion.div>
  );
}
