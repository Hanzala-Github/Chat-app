import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import Picker from "emoji-picker-react";
import { SelectImagePopup } from "./SelectImagePopup";
import { DiscardImagePopup } from "./DiscardImagePopup";
import { useStates } from "../store/useStates";
import { ReplyChat } from "./ReplyChat";

export const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [inputDisabled, setinputDisabled] = useState(false);
  const fileInputRef = useRef(null);
  const sendMessage = useChatStore.getState().sendMessage;
  const discardImage = useStates((state) => state.discardImage);
  const isReplyChatOpen = useStates((state) => state.isReplyChatOpen);
  const setSingleMessageReply = useStates.getState().setSingleMessageReply;
  const setIsReplyChatOpen = useStates.getState().setIsReplyChatOpen;
  const storeMessageIdOnReplyMessage = useStates(
    (state) => state.storeMessageIdOnReplyMessage
  );
  // setUpdateMessagesArray
  useEffect(() => {
    if (imagePreview) {
      setinputDisabled(true);
    } else {
      setinputDisabled(false);
    }
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setText("");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // setUpdateMessagesArray(true);
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        ...(storeMessageIdOnReplyMessage && {
          isReply: true,
          replyTo: storeMessageIdOnReplyMessage,
        }),
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const handleShowPicker = (e) => {
    e.stopPropagation();
    setShowPicker((prev) => !prev);
  };

  // ..........This is the jsx return part............//
  return (
    <div className="p-4 w-full flex items-end justify-center relative border-t border-base-300 h-auto flex-col">
      {!!isReplyChatOpen && <ReplyChat />}

      {imagePreview && (
        <SelectImagePopup
          imagePreview={imagePreview}
          removeImage={removeImage}
          setShowPicker={setShowPicker}
          text={text}
          setText={setText}
          handleSendMessage={handleSendMessage}
        />
      )}
      {imagePreview && discardImage && (
        <DiscardImagePopup setImagePreview={setImagePreview} />
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 flex-1 w-full"
      >
        <div className="flex-1 flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-circle ml-1"
            onClick={handleShowPicker}
          >
            <Smile size={22} />
          </button>
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          <input
            onClick={() => setShowPicker(false)}
            type="text"
            className="w-full focus:outline-none input-sm sm:input-md hover:bg-[#ffffff07] 
             pl-2 break-words whitespace-pre-wrap overflow-y-auto max-h-40 active:hover:bg-transparent focus:hover:bg-transparent"
            placeholder="Type a message"
            value={inputDisabled ? "" : text}
            onChange={(e) => !inputDisabled && setText(e.target.value)}
            disabled={inputDisabled}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
        {(text.length > 0 || imagePreview) && (
          <button
            onClick={() => {
              setShowPicker(false);
              setSingleMessageReply(null);
              setIsReplyChatOpen(false);
            }}
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={!text.trim() && !imagePreview}
          >
            <Send size={22} />
          </button>
        )}
      </form>

      {showPicker && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-14 left-0 z-50"
        >
          <Picker
            onEmojiClick={handleEmojiClick}
            style={{ height: "24rem" }}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
};
