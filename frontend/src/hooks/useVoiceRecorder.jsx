import React, { useRef, useState } from "react";

export function useVoiceRecorder() {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);

  const timerRef = useRef(null);

  /* ---------------- START ---------------- */
  // const startRecording = async () => {
  //   if (recording) return;

  //   if (!streamRef.current) {
  //     streamRef.current = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //     });
  //   }

  //   if (!mediaRecorderRef.current) {
  //     mediaRecorderRef.current = new MediaRecorder(streamRef.current);

  //     mediaRecorderRef.current.ondataavailable = (e) => {
  //       if (e.data.size) chunksRef.current.push(e.data);
  //     };
  //   }

  //   mediaRecorderRef.current.start();
  //   setRecording(true);
  //   setPaused(false);

  //   // ⏱ real-time seconds (no ms)
  //   timerRef.current = setInterval(() => {
  //     setDuration((d) => d + 1);
  //   }, 1000);
  // };

  const startRecording = async () => {
    if (recording) return;

    chunksRef.current = []; // 🔥 RESET
    setDuration(0);

    if (!streamRef.current) {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    }

    mediaRecorderRef.current = new MediaRecorder(streamRef.current);

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
    setPaused(false);

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  };

  /* ---------------- PAUSE ---------------- */
  const pauseRecording = () => {
    if (!mediaRecorderRef.current || paused) return;

    mediaRecorderRef.current.pause();
    clearInterval(timerRef.current);
    setPaused(true);
  };

  /* ---------------- RESUME ---------------- */
  const resumeRecording = () => {
    if (!mediaRecorderRef.current || !paused) return;

    mediaRecorderRef.current.resume();
    setPaused(false);

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  };

  /* ---------------- STOP ---------------- */
  // const stopRecording = () => {
  //   if (!mediaRecorderRef.current) return;

  //   mediaRecorderRef.current.stop();
  //   clearInterval(timerRef.current);

  //   const finalBlob = new Blob(chunksRef.current, {
  //     type: "audio/webm",
  //     // type: "audio/ogg; codecs=opus",
  //   });

  //   setAudioBlob(finalBlob);
  //   setRecording(false);
  //   setPaused(false);
  // };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = () => {
      const finalBlob = new Blob(chunksRef.current, {
        type: mediaRecorderRef.current.mimeType,
      });

      setAudioBlob(finalBlob);
      setRecording(false);
      setPaused(false);
    };

    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
  };

  /* ---------------- CLEAR ---------------- */
  const clearRecording = () => {
    clearInterval(timerRef.current);

    chunksRef.current = [];
    setAudioBlob(null);
    setDuration(0);
    setRecording(false);
    setPaused(false);
  };

  return {
    recording,
    paused,
    audioBlob,
    duration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    clearRecording,
  };
}
