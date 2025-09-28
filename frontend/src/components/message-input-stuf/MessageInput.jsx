import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
// import { useChatStore } from "../../store/useChatStore";
import { useStates } from "../../store/useStates";
import {
  DiscardImagePopup,
  EmojiPickerButton,
  EmojiPopup,
  ImageUploadButton,
  ReplyChat,
  SelectImagePopup,
  SendButton,
  TextInputField,
} from "../component";
import { useFunctions } from "../../hooks/useFunctions";
import { useSendMessage } from "../../hooks/useChatQueries";

export const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const fileInputRef = useRef(null);

  // const sendMessage = useChatStore.getState().sendMessage;
  const selectedUser = useStates((state) => state.selectedUser);
  const sendMessageMutation = useSendMessage(selectedUser);
  const discardImage = useStates((state) => state.discardImage);
  const isReplyChatOpen = useStates((state) => state.isReplyChatOpen);
  const setIsReplyChatOpen = useStates.getState().setIsReplyChatOpen;
  const storeMessageIdOnReplyMessage = useStates(
    (state) => state.storeMessageIdOnReplyMessage
  );
  // console.log(isReplyChatOpen);
  // console.log("MessageInput");
  const setShowPicker = useStates.getState().setShowPicker;
  const showPicker = useStates((state) => state.showPicker);
  const { handleShowPicker } = useFunctions();
  console.log({ imagePreview, discardImage });
  console.log("MessageInput");
  // Disable text input if image is selected
  useEffect(() => {
    setInputDisabled(!!imagePreview);
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
    e.stopPropagation();
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      // await sendMessage({
      //   text: text.trim(),
      //   image: imagePreview,
      //   ...(storeMessageIdOnReplyMessage && {
      //     isReply: true,
      //     replyTo: storeMessageIdOnReplyMessage,
      //   }),
      // });
      await sendMessageMutation.mutateAsync({
        text: text.trim(),
        image: imagePreview,
        ...(storeMessageIdOnReplyMessage && {
          isReply: true,
          replyTo: storeMessageIdOnReplyMessage,
        }),
      });

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

  return (
    <div className="p-4 w-full flex items-end justify-center relative border-t border-base-300 h-auto flex-col">
      {!!isReplyChatOpen && <ReplyChat />}

      {imagePreview && (
        <SelectImagePopup
          imagePreview={imagePreview}
          removeImage={removeImage}
          text={text}
          setText={setText}
          handleSendMessage={handleSendMessage}
        />
      )}

      {imagePreview && discardImage && (
        <DiscardImagePopup
          setImagePreview={setImagePreview}
          fileInputRef={fileInputRef}
        />
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 flex-1 w-full"
      >
        <div className="flex-1 flex gap-2 items-center">
          <EmojiPickerButton onClick={handleShowPicker} />

          <ImageUploadButton
            fileInputRef={fileInputRef}
            imagePreview={imagePreview}
          />

          <TextInputField
            text={text}
            setText={setText}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            inputDisabled={inputDisabled}
            fileInputRef={fileInputRef}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <SendButton
          text={text}
          imagePreview={imagePreview}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          // setSingleMessageReply={setSingleMessageReply}
          setIsReplyChatOpen={setIsReplyChatOpen}
        />
      </form>

      {showPicker && <EmojiPopup onEmojiClick={handleEmojiClick} />}
    </div>
  );
};
