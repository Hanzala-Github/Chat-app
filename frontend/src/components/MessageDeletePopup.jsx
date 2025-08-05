import React from "react";
import { motion } from "framer-motion";
import { useStates } from "../store/useStates";
import { useChatStore } from "../store/useChatStore";

export function MessageDeletePopup({ deletedData, MsgText, deleteBtn }) {
  const setShowDeletePopup = useStates.getState().setShowDeletePopup;
  const deleteMessageForMe = useChatStore.getState().deleteMessageForMe;

  // ..............This is the jsx return part................//
  return (
    <motion.div className="fixed min-h-screen w-full flex items-center justify-center z-50 inset-0 bg-[#23272c11] ">
      <div className="flex flex-col items-center justify-between w-[425px]  bg-[#323233] border border-gray-600 rounded-[8px] overflow-hidden">
        <div className="p-6 flex flex-col gap-3.5 w-full">
          <div className="space-y-3">
            <h3 className="text-[21px]">Delete message?</h3>
            <p className="text-[14px]">{MsgText}</p>
          </div>
          {deletedData}
        </div>
        <div className="flex items-center justify-between gap-2.5 bg-[#161617] w-full p-6">
          {deleteBtn}
          <button
            onClick={() => setShowDeletePopup(false)}
            type="button"
            className="flex-1 bg-[#3b3b3c52] rounded-[6px] py-[7px] text-[13px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
