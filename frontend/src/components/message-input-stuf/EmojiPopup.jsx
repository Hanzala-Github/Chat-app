import React from "react";
import Picker from "emoji-picker-react";

export const EmojiPopup = ({ onEmojiClick }) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className="absolute bottom-14 left-0 z-50"
  >
    <Picker
      onEmojiClick={onEmojiClick}
      style={{ height: "24rem" }}
      theme="dark"
    />
  </div>
);
