import React from "react";
import { motion } from "framer-motion";
import { XCircle, Heart, Ban, Trash2, X } from "lucide-react";
import { useStates } from "../store/useStates";
import { useFunctions } from "../hooks/useFunctions";

export function ChatOptionsPopup({ handleSelectUser }) {
  const popupPosition = useStates((state) => state.popupPosition);
  const isShowCloseChat = useStates((state) => state.isShowCloseChat);
  const { handleDeleteMessagesHis } = useFunctions();

  return (
    // <div className="w-full h-screen bg-[#4d484848] fixed top-0 left-0 ">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`popup-content absolute z-50 bg-[#0d0e10] shadow-lg rounded-lg w-40 p-2 space-y-2 text-sm
        ${popupPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"}
        `}
    >
      {isShowCloseChat && (
        <button
          onClick={handleDeleteMessagesHis}
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
          onClick={handleSelectUser}
          className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]"
        >
          <X size={16} /> Close chat
        </button>
      )}
    </motion.div>
    // </div>
  );
}
