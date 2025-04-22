import React, { useState } from "react";
import {
  ChatContainer,
  NoChatSelected,
  Sidebar,
} from "../components/component";
import { useChatStore } from "../store/useChatStore";
import { useStates } from "../store/useStates";
export const HomePage = () => {
  const [rightPopUp, setRightPopUp] = useState(null);
  const { selectedUser } = useChatStore();
  const { setisShowCloseChat, setPopupPosition, setIsMessageHoverPopup } =
    useStates();

  const handleMouseRight = (e, user) => {
    e.preventDefault();
    if (user?._id !== selectedUser) {
      setisShowCloseChat(false);
    } else {
      setisShowCloseChat(true);
    }

    console.log(user?._id);
    const rect = e.target.getBoundingClientRect();
    console.log(rect);
    const isUpperHalf = rect.top < window.innerHeight / 2;
    setPopupPosition(isUpperHalf ? "bottom" : "top");

    setRightPopUp({
      user,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleClosePopup = () => {
    setRightPopUp(null);
    setIsMessageHoverPopup(false);
    console.log("Closed the all popups");
  };

  // ...............This is the jsx return part............//
  return (
    <div className="h-screen bg-base-200 relative">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar
              handleMouseRight={handleMouseRight}
              handleClosePopup={handleClosePopup}
              rightPopUp={rightPopUp}
              setRightPopUp={setRightPopUp}
            />

            {!selectedUser ? (
              <NoChatSelected handleClosePopup={handleClosePopup} />
            ) : (
              <ChatContainer
                handleClosePopup={handleClosePopup}
                setRightPopUp={setRightPopUp}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
