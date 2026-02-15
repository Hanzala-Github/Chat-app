// import { create } from "zustand";

// export const useVoiceRecorderStore = create((set, get) => ({
//   mediaRecorder: null,
//   chunks: [],
//   isRecording: false,
//   isPaused: false,
//   startTime: 0,
//   duration: 0,
//   audioBlob: null,

//   async startRecording() {
//     if (get().mediaRecorder) return;

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) {
//         get().chunks.push(e.data);
//       }
//     };

//     recorder.start();

//     set({
//       mediaRecorder: recorder,
//       isRecording: true,
//       isPaused: false,
//       startTime: Date.now(),
//       chunks: [],
//     });
//   },

//   pauseRecording() {
//     const recorder = get().mediaRecorder;
//     if (!recorder || recorder.state !== "recording") return;

//     recorder.pause();

//     set((state) => ({
//       isPaused: true,
//       duration: state.duration + (Date.now() - state.startTime) / 1000,
//     }));
//   },

//   resumeRecording() {
//     const recorder = get().mediaRecorder;
//     if (!recorder || recorder.state !== "paused") return;

//     recorder.resume();

//     set({
//       isPaused: false,
//       startTime: Date.now(),
//     });
//   },

//   stopRecording() {
//     const recorder = get().mediaRecorder;
//     if (!recorder) return;

//     recorder.stop();

//     const total = get().duration + (Date.now() - get().startTime) / 1000;

//     setTimeout(() => {
//       const blob = new Blob(get().chunks, { type: "audio/webm" });

//       set({
//         audioBlob: blob,
//         duration: Math.round(total),
//         isRecording: false,
//         isPaused: false,
//         mediaRecorder: null,
//       });
//     }, 200);
//   },

//   clearRecording() {
//     set({
//       mediaRecorder: null,
//       chunks: [],
//       audioBlob: null,
//       duration: 0,
//       isRecording: false,
//       isPaused: false,
//     });
//   },
// }));
