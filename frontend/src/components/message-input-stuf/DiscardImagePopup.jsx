import React from "react";
import { useStates } from "../../store/useStates";

export function DiscardImagePopup({ setImagePreview }) {
  const setDiscardImage = useStates.getState().setDiscardImage;

  const handleImageDiscard = () => {
    setDiscardImage(false);
    setImagePreview(null);
  };
  // ..............This is the jsx return part...............//

  return (
    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-screen w-full bg-[#35343440] flex items-center justify-center z-[60]">
      <div className="bg-[#111] h-[185px] max-w-[600px] w-full rounded-[10px] flex flex-col items-center justify-between overflow-hidden border border-gray-600">
        <div className="flex flex-col gap-[10px] p-5 w-full">
          <h2 className="text-[22px] font-[500] text-[#e9e7e7]">
            Discard unsent message?
          </h2>
          <p className="text-[14px] font-[400] text-[#e9e7e7]">
            Your message, including attached media, will not be sent if you
            leave this screen.
          </p>
        </div>
        <div className="flex gap-3 w-full bg-[#0a0a0a] p-5">
          <button
            onClick={handleImageDiscard}
            className="flex-1 bg-[#8a8af9] py-[7px] rounded-[5px] text-black hover:bg-[#8181ef]"
          >
            Discard
          </button>
          <button
            onClick={() => setDiscardImage(false)}
            className="flex-1 bg-[#3b3b3c] py-[7px] rounded-[5px] hover:bg-[#434343]"
          >
            Return to media
          </button>
        </div>
      </div>
    </div>
  );
}
