import React from "react";
import { useCallback } from "react";
import { useStates } from "../../store/useStates";

export const TextInputField = React.memo(
  ({
    // text,
    // setText,
    showPicker,
    setShowPicker,
    inputDisabled,
    handleTyping,
  }) => {
    const text = useStates((state) => state.text);
    const setText = useStates.getState().setText;

    const handleSetText = useCallback(
      (e) => {
        setText(e.target.value);
      },
      [setText]
    );
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
        // onChange={(e) => !inputDisabled && handleSetText(e)}
        onChange={(e) => {
          // !inputDisabled && handleSetText(e);
          if (!inputDisabled) {
            handleSetText(e);
          }
          handleTyping();
        }}
        disabled={inputDisabled}
      />
    );
  }
);
