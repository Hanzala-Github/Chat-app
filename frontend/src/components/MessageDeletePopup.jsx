import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStates } from "../store/useStates";

export function MessageDeletePopup() {
  const [deleteMessage, setDeleteMessage] = useState(false);
  const setShowDeletePopup = useStates.getState().setShowDeletePopup;
  const radioClass = `appearance-none w-4 h-4 rounded-full scale-[1.4] border border-gray-500
  ${
    deleteMessage
      ? "checked:bg-[#0e0e0f] checked:border-red-400 checked:border-4"
      : "checked:bg-[#232325] checked:border-gray-500"
  }`;

  // ..................This is the jsx return part................//
  return (
    <motion.div className="fixed min-h-screen w-full flex items-center justify-center z-50 inset-0 bg-[#23272c11] ">
      <div className="flex flex-col items-center justify-between w-[425px] h-[270px] bg-[#323233] border border-gray-600 rounded-[8px] overflow-hidden">
        <div className="p-6 flex flex-col gap-3.5">
          <div className="space-y-3">
            <h3 className="text-[21px]">Delete message?</h3>
            <p className="text-[14px]">
              You can delete messages for everyone or just for yourself.
            </p>
          </div>
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
              <input type="radio" name="Delete" className={radioClass} />
              <p className="text-[14px]">Delete for everyone</p>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-evenly bg-[#161617] w-full p-6">
          <button
            type="button"
            className={`w-[170px] ${
              deleteMessage ? "bg-red-400" : "bg-[#3b3b3c]"
            } rounded-[6px] py-[7px] text-[13px] ${
              deleteMessage && "text-black"
            }`}
          >
            Delete
          </button>
          <button
            onClick={() => setShowDeletePopup(false)}
            type="button"
            className="w-[170px] bg-[#3b3b3c52] rounded-[6px] py-[7px] text-[13px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
