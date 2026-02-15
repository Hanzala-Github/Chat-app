import React from "react";
import { Mic, Send, Loader2 } from "lucide-react";
import { useStates } from "../../store/useStates";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";

export const SendButton = ({
  imagePreview,
  showPicker,
  setShowPicker,
  setIsReplyChatOpen,
}) => {
  const isSending = useStates((s) => s.isSending);
  const text = useStates((s) => s.text);
  const setIsRecordingStart = useStates.getState().setIsRecordingStart;
  const setSingleMessageReply = useStates.getState().setSingleMessageReply;
  // const { startRecording } = useVoiceRecorder();

  const hasContent = text.trim() || imagePreview;

  const cleanup = (e) => {
    e.stopPropagation();
    if (showPicker) setShowPicker(false);
    setSingleMessageReply(null);
    setIsReplyChatOpen(false);
  };

  // SEND BUTTON
  if (hasContent) {
    return (
      <button
        type="submit"
        className="btn btn-sm btn-circle"
        disabled={isSending}
        onClick={cleanup}
      >
        {isSending ? <Loader2 className="animate-spin" /> : <Send size={22} />}
      </button>
    );
  }

  // MIC BUTTON
  return (
    <button
      type="button"
      className="btn btn-sm btn-circle"
      disabled={isSending}
      onClick={(e) => {
        cleanup(e);
        // startRecording();
        setIsRecordingStart(true);
      }}
    >
      <Mic />
    </button>
  );
};
