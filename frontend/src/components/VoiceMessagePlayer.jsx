import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Download } from "lucide-react";

export function VoiceMessagePlayer({
  url,
  duration,
  mimeType,
  isSender,
  // isReceiverOnline,
}) {
  const audioRef = useRef(null);
  const barRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 - 100
  const [isDragging, setIsDragging] = useState(false);

  /* ---------------- PLAY / PAUSE ---------------- */
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Audio play error:", err);
    }
  };

  /* ---------------- UPDATE PROGRESS ---------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (!isDragging) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnd = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", onEnd);
    };
  }, [isDragging]);

  /* ---------------- SCRUB LOGIC ---------------- */
  const seekByClientX = (clientX) => {
    const bar = barRef.current;
    const audio = audioRef.current;
    if (!bar || !audio) return;

    const rect = bar.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));

    audio.currentTime = percent * audio.duration;
    setProgress(percent * 100);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    seekByClientX(e.clientX);

    const move = (e) => seekByClientX(e.clientX);
    const up = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  /* ---------------- WAVEFORM DATA (FAKE, LIKE WHATSAPP) ---------------- */
  const waves = Array.from(
    { length: 30 },
    () => Math.floor(Math.random() * 18) + 4
  );

  const activeBars = Math.floor((progress / 100) * waves.length);

  /* ---------------- FORMAT TIME ---------------- */
  const formatDuration = (sec) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl w-[280px]
        ${isSender ? "bg-[#5251D4]" : "bg-[#4A5565]"}`}
    >
      {/* ▶️ Play / Pause */}
      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full flex items-center justify-center"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      {/* 🌊 Waveform Scrubber */}
      <div
        ref={barRef}
        onMouseDown={handleMouseDown}
        className="flex-1 h-8 flex items-center gap-[2px] cursor-pointer relative"
      >
        {waves.map((h, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-colors
              ${i <= activeBars ? "bg-white" : "bg-white/30"}`}
            style={{ height: h }}
          />
        ))}

        {/* 🔘 Draggable knob */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#01fffb] rounded-full"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* ⏱ Duration */}
      <span className="text-xs text-white min-w-[40px] text-right">
        {formatDuration(duration)}
      </span>

      {/* ⬇️ Download */}
      {/* {!isSender && !isReceiverOnline && (
        <a href={url} download>
          <Download size={16} className="text-white opacity-80" />
        </a>
      )} */}

      {/* <audio ref={audioRef} src={url} preload="metadata" />
       */}
      <audio ref={audioRef} preload="metadata">
        <source src={url} type={mimeType} />
      </audio>
    </div>
  );
}
