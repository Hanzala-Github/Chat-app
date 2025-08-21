import React from "react";
import { Sidebar, ChatView } from "../components/component";
// import {  } from "../components/ChatView";
export const HomePage = () => {
  console.log("Homeeee");
  // ...............This is the jsx return part............//
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
