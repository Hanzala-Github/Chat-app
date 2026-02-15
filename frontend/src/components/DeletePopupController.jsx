import React, { useState, useMemo } from "react";
import { MessageDeletePopup } from "./MessageDeletePopup";
import { useAuthStore } from "../store/useAuthStore";
import { useStates } from "../store/useStates";
import {
  useDeleteMessageForEveryone,
  useDeleteMessageForMe,
  useGetMessages,
} from "../hooks/useChatQueries";
import { Ban } from "lucide-react";

export const DeletePopupController = React.memo(
  function DeletePopupController() {
    const [deleteMessage, setDeleteMessage] = useState(false);
    const [isDeleteForEveryOne, setIsDeleteForEveryOne] = useState(false);

    const selectedUser = useStates((state) => state.selectedUser);
    const authUser = useAuthStore((state) => state.authUser);
    const { data: messages = [] } = useGetMessages(selectedUser);

    const storeMsgIdToSetDeleteMsgPopup = useStates(
      (state) => state.storeMsgIdToSetDeleteMsgPopup,
    );
    const showDeletePopup = useStates((state) => state.showDeletePopup);
    const setShowDeletePopup = useStates.getState().setShowDeletePopup;

    const deleteMessageForMe = useDeleteMessageForMe();
    const deleteMessageForEveryOne = useDeleteMessageForEveryone(selectedUser);

    const msg = useMemo(
      () => messages.find((m) => m._id === storeMsgIdToSetDeleteMsgPopup),
      [messages, storeMsgIdToSetDeleteMsgPopup],
    );

    const findMsg = msg?.senderId === authUser?._id;
    const findformeMsg = msg?.senderId !== authUser?._id;

    const radioClass = `appearance-none w-4 h-4 rounded-full scale-[1.4] border border-gray-500
    ${
      deleteMessage
        ? "checked:bg-[#0e0e0f] checked:border-red-400 checked:border-4"
        : "checked:bg-[#232325] checked:border-gray-500"
    }`;

    const handleDeleteForMe = (e) => {
      e.stopPropagation();
      setShowDeletePopup(false);
      setDeleteMessage(false);
      deleteMessageForMe.mutate(storeMsgIdToSetDeleteMsgPopup);
    };

    const handleDeleteForMeOrEveryOne = (e) => {
      e.stopPropagation();
      setShowDeletePopup(false);
      setDeleteMessage(false);
      deleteMessageForEveryOne.mutate(storeMsgIdToSetDeleteMsgPopup);
    };

    if (!showDeletePopup || !msg) return null;

    return (
      <>
        {findMsg ? (
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
                className={`flex items-center justify-center flex-1 ${
                  deleteMessage ? "bg-red-400" : "bg-[#3b3b3c]"
                } rounded-[6px] py-[7px] text-[13px] ${
                  deleteMessage && "text-black"
                }`}
                disabled={deleteMessage === false}
              >
                {/* {Delete} */}
                {deleteMessage === false ? (
                  <Ban className="text-gray-500" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            }
            cancelBtn={
              <button
                onClick={() => {
                  setDeleteMessage(false);
                  setShowDeletePopup(false);
                }}
                type="button"
                className="flex-1 bg-[#3b3b3c52] rounded-[6px] py-[7px] text-[13px]"
              >
                Cancel
              </button>
            }
            MsgText="You can delete messages for everyone or just for yourself."
          />
        ) : (
          <MessageDeletePopup
            deleteBtn={
              <button
                onClick={findformeMsg && handleDeleteForMe}
                type="button"
                className="flex-1 bg-red-400 rounded-[6px] py-[7px] text-[13px] text-black"
              >
                Delete for me
              </button>
            }
            cancelBtn={
              <button
                onClick={() => {
                  setDeleteMessage(false);
                  setShowDeletePopup(false);
                }}
                type="button"
                className="flex-1 bg-[#3b3b3c52] rounded-[6px] py-[7px] text-[13px]"
              >
                Cancel
              </button>
            }
            MsgText="This has no effect on your recipients' chat."
          />
        )}
      </>
    );
  },
);
