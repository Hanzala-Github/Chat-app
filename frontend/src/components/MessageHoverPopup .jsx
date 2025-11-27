// .......................................................................//
import React from "react";
import { motion } from "framer-motion";
import { Reply, Copy, Save, Plus, Trash2 } from "lucide-react";
import { useStates } from "../store/useStates";
// import { useChatStore } from "../store/useChatStore";
import { toast } from "sonner";
import { useFunctions } from "../hooks/useFunctions";
import { useAuthStore } from "../store/useAuthStore";
import { useGetMessages } from "../hooks/useChatQueries";

export function MessageHoverPopup() {
  // const messages = useChatStore((state) => state.messages);
  const selectedUser = useStates((state) => state.selectedUser);
  const authUser = useAuthStore((state) => state.authUser);
  const { data: messages = [] } = useGetMessages(selectedUser);
  const popupPosition = useStates((state) => state.popupPosition);
  const popupPositionLeftRight = useStates(
    (state) => state.popupPositionLeftRight
  );
  const storeMessageId = useStates((state) => state.storeMessageId);
  const setSingleMessageReply = useStates.getState().setSingleMessageReply;
  const setIsReplyChatOpen = useStates.getState().setIsReplyChatOpen;
  const setStoreMessageId = useStates.getState().setStoreMessageId;
  const setStoreMessageIdOnReplyMessage =
    useStates.getState().setStoreMessageIdOnReplyMessage;
  const setShowDeletePopup = useStates.getState().setShowDeletePopup;
  console.log(authUser);
  const findMsg = messages.filter((msg) => msg._id === storeMessageId);

  // console.log(findMsg);
  // console.log(findMsg[0]?.senderId, authUser?._id);

  console.log("MessageHoverPopup");

  const { handleShowPicker } = useFunctions();

  const handleReplyPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReplyChatOpen(true);
    setStoreMessageIdOnReplyMessage(storeMessageId);
    setStoreMessageId(null);
    // setSingleMessageReply(messages.filter((msg) => msg._id === storeMessageId));
    setSingleMessageReply(findMsg);
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      const text = messages.filter((msg) => msg._id === storeMessageId)?.[0]
        ?.text;

      await navigator.clipboard.writeText(text);
      toast.success("message text copied");
      // You can also show a toast or tooltip here
    } catch (err) {
      console.error("Failed to copy!", err);
    } finally {
      setStoreMessageId(null);
    }
  };

  const handleDelete = () => {
    setShowDeletePopup(true);
    setStoreMessageId(null);
  };

  // ...................This is the jsx return part.................//

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`popup-content absolute z-50 bg-[#0d0e10] shadow-lg rounded-lg w-40 p-2 space-y-2 text-sm
        ${popupPosition === "top" ? "bottom-[55%] mb-2" : "top-[55%] mt-2"} 
        ${popupPositionLeftRight === "left" ? "right-[50%]" : "left-[50%]"}`}
    >
      <button
        onClick={handleReplyPopup}
        className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]"
      >
        <Reply size={16} /> Reply
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px] border-b border-b-[#5857575b] pb-3.5"
      >
        <Copy size={16} /> Copy
      </button>

      <button
        onClick={handleDelete}
        className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px]"
      >
        <Trash2 size={16} />
        {findMsg[0]?.senderId === authUser?._id ? "Delete" : "Delete for me"}
      </button>
      <button className="flex items-center gap-2 w-full px-2 py-1 hover:bg-[#22262d] rounded-[5px] border-b border-b-[#5857575b] pb-3.5">
        <Save size={16} /> Save as
      </button>
      <div className="flex justify-between items-center">
        <span className="text-[20px] cursor-pointer">👍</span>
        <span className="text-[20px]">😂</span>
        <span className="text-[20px]">😢</span>
        <span className="text-[20px]">❤️</span>
        <span
          onClick={(e) => {
            handleShowPicker(e);
            setStoreMessageId(null);
          }}
          className="text-[20px] border border-[#cfcfcf33] p-[2px] rounded-full"
        >
          <Plus className="size-4 text-gray-300" />
        </span>
      </div>
    </motion.div>
  );
}
