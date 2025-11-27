import React, { useEffect } from "react";
import { Sidebar, ChatView } from "../components/component";
import { useAuthStore } from "../store/useAuthStore";
// import { getChatId } from "../lib/utils";
// import { useStates } from "../store/useStates";

// import {  } from "../components/ChatView";
export const HomePage = () => {
  console.log("Homeeee");
  // ...............This is the jsx return part............//

  const socket = useAuthStore((state) => state.socket);
  // HomePage.jsx
  useEffect(() => {
    if (!socket) return;

    socket.emit("userActive"); // one-time on connect or refresh
    console.log("🟢 userActive emitted on mount");

    return () => {
      socket.off("userActive");
    };
  }, [socket]);

  // // const selectedUser = useStates((state) => state.selectedUser);
  // // const authUser = useAuthStore((state) => state.authUser);

  // useEffect(() => {
  //   if (!socket) return;

  //   let lastEmitTime = 0;

  //   const emitUserActive = () => {
  //     const now = Date.now();
  //     // prevent spam every tiny mouse move; emit once per 3 seconds max
  //     if (now - lastEmitTime > 3000) {
  //       console.log("🟢 User active - emit userActive");
  //       socket.emit("userActive");
  //       lastEmitTime = now;
  //     }
  //   };

  //   // fire whenever user interacts (mouse, keyboard, focus, tab visible again)
  //   window.addEventListener("mousemove", emitUserActive);
  //   window.addEventListener("keydown", emitUserActive);
  //   window.addEventListener("focus", emitUserActive);
  //   document.addEventListener("visibilitychange", () => {
  //     if (document.visibilityState === "visible") emitUserActive();
  //   });

  //   return () => {
  //     window.removeEventListener("mousemove", emitUserActive);
  //     window.removeEventListener("keydown", emitUserActive);
  //     window.removeEventListener("focus", emitUserActive);
  //     document.removeEventListener("visibilitychange", emitUserActive);
  //   };
  // }, [socket]);

  return (
    <div className="h-screen bg-base-200 relative">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            <ChatView />
          </div>
        </div>
      </div>
    </div>
  );
};
