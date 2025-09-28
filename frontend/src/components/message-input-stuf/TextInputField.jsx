import React from "react";
import { useCallback } from "react";

export const TextInputField = React.memo(
  ({ text, setText, showPicker, setShowPicker, inputDisabled }) => {
    const handleSetText = useCallback((e) => {
      setText(e.target.value);
    }, []);
    console.log("TextInputField");
    return (
      <input
        onClick={(e) => {
          e.stopPropagation();
          if (showPicker) setShowPicker(false);
        }}
        type="text"
        className="w-full focus:outline-none input-sm sm:input-md hover:bg-[#ffffff07]
    pl-2 break-words whitespace-pre-wrap overflow-y-auto max-h-40"
        placeholder="Type a message"
        value={inputDisabled ? "" : text}
        onChange={(e) => !inputDisabled && handleSetText(e)}
        disabled={inputDisabled}
      />
    );
  }
);
