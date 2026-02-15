import React, { useEffect } from "react";
import { Sidebar, ChatView } from "../components/component";
import { useAuthStore } from "../store/useAuthStore";

export const HomePage = () => {
  console.log("Homeeee");
  // ...............This is the jsx return part............//

  const socket = useAuthStore((state) => state.socket);
  useEffect(() => {
    if (!socket) return;

    socket.emit("userActive"); // one-time on connect or refresh
    console.log("🟢 userActive emitted on mount");

    return () => {
      socket.off("userActive");
    };
  }, [socket]);

  return (
    <main className="h-screen bg-base-200 relative">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            <ChatView />
          </div>
        </div>
      </div>
    </main>
  );
};
