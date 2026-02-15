import React from "react";
import { useStates } from "../store/useStates";

export function functionsHook() {
  const { setRightPopUp, setIsMessageHoverPopup } = useStates();

  const handleClosePopup = (e) => {
    e.stopPropagation();
    setRightPopUp(null);
    setIsMessageHoverPopup(false);
    console.log("Closed the all popups");
  };

  return { handleClosePopup };
}
