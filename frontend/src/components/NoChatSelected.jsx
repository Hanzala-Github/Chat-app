import React from "react";
import { MessageSquare } from "lucide-react";

export function NoChatSelected({ handleClosePopup }) {
  return (
    <div
      onClick={handleClosePopup}
      className="flex-1 h-full flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-[#1D232A] px-6"
    >
      <div className="max-w-md text-center">
        <div className="p-6 bg-white dark:bg-[#1D232A] shadow-xl rounded-xl">
          <MessageSquare
            size={80}
            className="text-gray-400 dark:text-gray-600 mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Welcome to Chatty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select a conversation to start messaging. If you don’t have any
            chats, create a new one!
          </p>
        </div>
      </div>
    </div>
  );
}
