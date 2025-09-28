// ..............................................................//
import React, { useEffect, useState } from "react";
import { MessageDeletePopup, MessageList } from "./component";
import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";
import { useStates } from "../store/useStates";
import {
  useDeleteMessageById,
  useDeleteMessageForEveryone,
  useDeleteMessageForMe,
  useGetMessages,
} from "../hooks/useChatQueries";
// import { MessageList } from "./MessageList";

export const ChatBubble = React.memo(function ChatBubble() {
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [isDeleteForEveryOne, setIsDeleteForEveryOne] = useState(false);

  // const users = useChatStore((state) => state.users);
  // const messages = useChatStore((state) => state.messages);

  // const selectedUser = useChatStore((state) => state.selectedUser);
  const selectedUser = useStates((state) => state.selectedUser);
  const { data: messages = [] } = useGetMessages(selectedUser);

  console.log(messages);
  const authUser = useAuthStore((state) => state.authUser);

  const storeMsgIdToSetDeleteMsgPopup = useStates(
    (state) => state.storeMsgIdToSetDeleteMsgPopup
  );
  const showDeletePopup = useStates((state) => state.showDeletePopup);
  const setShowDeletePopup = useStates.getState().setShowDeletePopup;

  // const deleteMessageForMe = useChatStore.getState().deleteMessageForMe;

  const deleteMessageForMe = useDeleteMessageForMe();

  // const deleteMessageForEveryOne =
  //   useChatStore.getState().deleteMessageForEveryOne;
  const deleteMessageForEveryOne = useDeleteMessageForEveryone(selectedUser);

  // const deleteMessageById = useChatStore.getState().deleteMessageById;
  const deleteMessageById = useDeleteMessageById(selectedUser);

  const socket = useAuthStore((state) => state.socket);

  console.log(messages);
  console.log("ChatBubble re-render");

  // SOCKET LISTENER: receiveDeletedMessage (kept here as original)

  useEffect(() => {
    const onDelete = ({ messageId }) => {
      deleteMessageById(messageId);
    };

    if (!socket) return;
    socket.on("receiveDeletedMessage", onDelete);

    return () => {
      socket.off("receiveDeletedMessage", onDelete);
    };
  }, [socket, deleteMessageById]);

  // compute whether selected msg was sent by authUser
  const findMsg =
    messages.filter((msg) => msg._id === storeMsgIdToSetDeleteMsgPopup)[0]
      ?.senderId === authUser?._id;

  const findformeMsg =
    messages.filter((msg) => msg._id === storeMsgIdToSetDeleteMsgPopup)[0]
      ?.senderId !== authUser?._id;

  // const findMsg =
  //   messages.find((msg) => msg._id === storeMsgIdToSetDeleteMsgPopup)
  //     ?.senderId === authUser?._id;

  // const findformeMsg =
  //   messages.find((msg) => msg._id === storeMsgIdToSetDeleteMsgPopup)
  //     ?.senderId !== authUser?._id;

  // radio class exactly as in your original code
  const radioClass = `appearance-none w-4 h-4 rounded-full scale-[1.4] border border-gray-500
  ${
    deleteMessage
      ? "checked:bg-[#0e0e0f] checked:border-red-400 checked:border-4"
      : "checked:bg-[#232325] checked:border-gray-500"
  }`;

  const handleDeleteForMe = (e) => {
    e.stopPropagation();
    setShowDeletePopup(false);
    deleteMessageForMe.mutate(storeMsgIdToSetDeleteMsgPopup);
  };

  const handleDeleteForMeOrEveryOne = (e) => {
    e.stopPropagation();
    setShowDeletePopup(false);
    // deleteMessageForEveryOne(storeMsgIdToSetDeleteMsgPopup, selectedUser);
    deleteMessageForEveryOne.mutate(storeMsgIdToSetDeleteMsgPopup);
  };

  console.log("ChatBubble component");

  // the wrapper: delete popup (kept) + the message list component
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
      {/* MessageDeletePopup component (unchanged behavior) */}
      {findMsg
        ? showDeletePopup && (
            <MessageDeletePopup
              deletedData={
                <div className="space-y-3">
                  <label className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      onChange={() => {
                        setDeleteMessage(true);
                        setIsDeleteForEveryOne(false);
                      }}
                      name="Delete"
                      className={radioClass}
                    />
                    <p className="text-[14px]">Delete for me</p>
                  </label>
                  <label className="flex items-center gap-2.5">
                    <input
                      onChange={() => {
                        setDeleteMessage(true);
                        setIsDeleteForEveryOne(true);
                      }}
                      type="radio"
                      name="Delete"
                      className={radioClass}
                    />
                    <p className="text-[14px]">Delete for everyone</p>
                  </label>
                </div>
              }
              deleteBtn={
                <button
                  onClick={
                    findMsg && isDeleteForEveryOne
                      ? handleDeleteForMeOrEveryOne
                      : handleDeleteForMe
                  }
                  type="button"
                  className={`flex-1 ${
                    deleteMessage ? "bg-red-400" : "bg-[#3b3b3c]"
                  } rounded-[6px] py-[7px] text-[13px] ${
                    deleteMessage && "text-black"
                  }`}
                >
                  Delete
                </button>
              }
              MsgText="You can delete messages for everyone or just for yourself."
            />
          )
        : showDeletePopup && (
            <MessageDeletePopup
              deleteBtn={
                <button
                  onClick={findformeMsg && handleDeleteForMe}
                  type="button"
                  className={`flex-1 bg-red-400 
                   rounded-[6px] py-[7px] text-[13px] text-black`}
                >
                  Delete for me
                </button>
              }
              MsgText="This has no effect on your recipients' chat."
            />
          )}

      {/* MessageList: contains the scroll effect + message mapping */}
      {/* <MessageList setRightPopUp={setRightPopUp} /> */}
      <MessageList />
    </div>
  );
});
