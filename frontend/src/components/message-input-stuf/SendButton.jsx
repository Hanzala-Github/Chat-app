import React from "react";
import { Send } from "lucide-react";

export const SendButton = ({
  text,
  imagePreview,
  showPicker,
  setShowPicker,
  setSingleMessageReply,
  setIsReplyChatOpen,
}) => {
  if (!text.length && !imagePreview) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (showPicker) setShowPicker(false);
        setSingleMessageReply(null);
        setIsReplyChatOpen(false);
      }}
      type="submit"
      className="btn btn-sm btn-circle"
      disabled={!text.trim() && !imagePreview}
    >
      <Send size={22} />
    </button>
  );
};
