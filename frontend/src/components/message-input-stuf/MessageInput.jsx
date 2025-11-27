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
import { useAuthStore } from "../../store/useAuthStore";
import { getChatId } from "../../lib/utils";

export const MessageInput = () => {
  // const [text, setText] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeout = useRef(null);

  // const sendMessage = useChatStore.getState().sendMessage;
  const socket = useAuthStore((state) => state.socket);
  const authUser = useAuthStore((state) => state.authUser);

  const selectedUser = useStates((state) => state.selectedUser);
  const sendMessageMutation = useSendMessage(selectedUser);
  const discardImage = useStates((state) => state.discardImage);
  const isReplyChatOpen = useStates((state) => state.isReplyChatOpen);
  const setIsReplyChatOpen = useStates.getState().setIsReplyChatOpen;
  const storeMessageIdOnReplyMessage = useStates(
    (state) => state.storeMessageIdOnReplyMessage
  );

  const setStoreMessageIdOnReplyMessage =
    useStates.getState().setStoreMessageIdOnReplyMessage;

  const text = useStates((state) => state.text);
  const setText = useStates.getState().setText;

  // console.log(isReplyChatOpen);
  // console.log("MessageInput");
  const setShowPicker = useStates.getState().setShowPicker;
  const showPicker = useStates((state) => state.showPicker);
  const isSending = useStates((state) => state.isSending);
  const setIsSending = useStates.getState().setIsSending;
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
    if (isSending) return;
    if (!text.trim() && !imagePreview) return;
    setIsSending(true);
    try {
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
    } finally {
      setIsSending(false);
      // ------new................//
      setStoreMessageIdOnReplyMessage(null);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    // setText((prev) => prev + emojiObject.emoji);
    setText(text + emojiObject.emoji);
  };

  const handleTyping = () => {
    const chatId = getChatId(authUser?._id, selectedUser);

    socket.emit("typing", {
      chatId,
      userId: authUser?._id,
    });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", {
        chatId,
        userId: authUser?._id,
      });
    }, 2000);
  };

  // ..............This is the jsx return part.................//

  return (
    <div className="p-4 w-full flex items-end justify-center relative border-t border-base-300 h-auto flex-col">
      {!!isReplyChatOpen && <ReplyChat />}

      {imagePreview && (
        <SelectImagePopup
          imagePreview={imagePreview}
          removeImage={removeImage}
          // text={text}
          // setText={setText}
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
            // text={text}
            // setText={setText}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            inputDisabled={inputDisabled}
            fileInputRef={fileInputRef}
            handleTyping={handleTyping}
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
          // text={text}
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
