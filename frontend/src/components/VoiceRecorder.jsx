import React from "react";
import { CircleStop, Mic, Pause, Send, Trash } from "lucide-react";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { useStates } from "../store/useStates";

export function VoiceRecorder({ onSend }) {
  const {
    recording,
    paused,
    audioBlob,
    duration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    clearRecording,
  } = useVoiceRecorder();

  const setIsRecordingStart = useStates.getState().setIsRecordingStart;

  const handleSend = () => {
    if (!audioBlob) return;
    onSend(audioBlob, duration);
    clearRecording();
    setIsRecordingStart(false);
  };

  return (
    <div className="flex items-center gap-3 w-full bg-base-200 px-4 py-3 rounded-xl">
      {/* Trash */}
      <button
        onClick={() => {
          clearRecording();
          setIsRecordingStart(false);
        }}
      >
        <Trash />
      </button>

      {/* Mic / Pause */}
      {!recording && !audioBlob && (
        <button onClick={startRecording}>
          <Mic />
        </button>
      )}

      {recording && !paused && (
        <button onClick={pauseRecording}>
          <Pause />
        </button>
      )}

      {paused && (
        <button onClick={resumeRecording}>
          <Mic />
        </button>
      )}

      {/* Timer (seconds only) */}
      <span className="text-sm min-w-[40px]">{duration}s</span>

      <div className="flex-1" />

      {/* Stop */}
      {recording && (
        <button onClick={stopRecording}>
          <CircleStop color="red" size={19} />
        </button>
      )}

      {/* Send */}
      {audioBlob && !recording && (
        <button onClick={handleSend} className="btn btn-circle btn-primary">
          <Send size={18} />
        </button>
      )}
    </div>
  );
}
