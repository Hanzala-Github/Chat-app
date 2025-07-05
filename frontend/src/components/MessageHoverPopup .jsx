import React, { useState } from "react";
import { motion } from "framer-motion";
import { Reply, Copy, Save, Plus } from "lucide-react";
import { useStates } from "../store/useStates";
import Picker from "emoji-picker-react";

export function MessageHoverPopup() {
  const {
    popupPosition,
    popupPositionLeftRight,
    setIsReplyChatOpen,
    setStoreMessageId,
  } = useStates();
  const [showPicker, setShowPicker] = useState(false);

  const handleReplyPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReplyChatOpen(true);
    setStoreMessageId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`popup-content absolute z-50 bg-[#0d0e10] shadow-lg rounded-lg w-40 p-2 space-y-2 text-sm
        ${popupPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"} 
        ${popupPositionLeftRight === "left" ? "right-[50%]" : "left-[50%]"}`}
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
        <span className="text-[20px] cursor-pointer">👍</span>
        <span className="text-[20px]">😂</span>
        <span className="text-[20px]">😢</span>
        <span className="text-[20px]">❤️</span>
        <span className="text-[20px] border border-[#cfcfcf33] p-[2px]">
          <Plus className="size-4 text-gray-300" />
        </span>
      </div>
    </motion.div>
  );
}
