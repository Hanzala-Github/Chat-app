import React from "react";
import { Send, X } from "lucide-react";
import { motion } from "framer-motion";

import { useStates } from "../store/useStates";

export function SelectImagePopup({
  imagePreview,
  removeImage,
  // setShowPicker,
  // text,
  // setText,
  handleSendMessage,
}) {
  const setDiscardImage = useStates.getState().setDiscardImage;
  const setShowPicker = useStates.getState().setShowPicker;
  const showPicker = useStates((state) => state.showPicker);
  const text = useStates((state) => state.text);
  const setText = useStates.getState().setText;

  console.log("SelectImagePopup");

  // ..................This is the jsx return part....................//
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2 }}
      onClick={() => setDiscardImage(true)}
      className="fixed min-h-screen w-full flex items-center justify-center z-50 inset-0"
    >
      {/* Image Preview */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-3 bg-white/10
       backdrop-blur-lg shadow-lg p-2 rounded-xl border border-white/20 h-96 w-[400px] absolute bottom-30 left-[35%] -translate-x-1/2"
      >
        <div className="relative w-full h-full flex flex-col justify-between">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-[80%] object-cover rounded-xl border border-gray-700"
          />
          {/* Close Button */}
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 text-white 
          flex items-center justify-center shadow-md hover:bg-red-500 transition"
            type="button"
          >
            <X className="size-4" />
          </button>
          <form
            onSubmit={handleSendMessage}
            className="flex bg-[#1D232A] items-center justify-center h-[15%] rounded-[5px]"
          >
            <input
              onClick={() => {
                if (showPicker) setShowPicker(false);
              }}
              type="text"
              className="border border-none focus:outline-none  rounded-lg input-sm sm:input-md w-full py-3 pl-1.5"
              placeholder="Caption (optional)"
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                // showPicker === true && setShowPicker(false);
                if (showPicker) setShowPicker(false);
              }}
              type="submit"
              className="btn btn-sm bg-[#5251D4] h-[80%] mx-1.5"
              disabled={!text.trim() && !imagePreview}
            >
              <Send size={22} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
