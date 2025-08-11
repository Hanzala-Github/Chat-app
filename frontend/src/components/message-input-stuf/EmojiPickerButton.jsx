import React from "react";
import { Smile } from "lucide-react";

export const EmojiPickerButton = ({ onClick }) => (
  <button
    type="button"
    className="btn btn-sm btn-circle ml-1"
    onClick={onClick}
  >
    <Smile size={22} />
  </button>
);
