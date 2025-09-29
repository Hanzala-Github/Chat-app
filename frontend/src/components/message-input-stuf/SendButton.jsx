import React from "react";
import { Send } from "lucide-react";
import { useStates } from "../../store/useStates";

export const SendButton = ({
  // text,
  imagePreview,
  showPicker,
  setShowPicker,
  // setSingleMessageReply,
  setIsReplyChatOpen,
}) => {
  const setSingleMessageReply = useStates.getState().setSingleMessageReply;
  const text = useStates((state) => state.text);
  console.log("SendButton");

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
