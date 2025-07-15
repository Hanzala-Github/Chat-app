import { useChatStore } from "../store/useChatStore";
import { useStates } from "../store/useStates";
export function useFunctions() {
  const setRightPopUp = useStates.getState().setRightPopUp;
  const setIsMessageHoverPopup = useStates.getState().setIsMessageHoverPopup;
  const setisShowCloseChat = useStates.getState().setisShowCloseChat;
  const setPopupPosition = useStates.getState().setPopupPosition;
  const setStoreMessageId = useStates.getState().setStoreMessageId;
  const selectedUser = useChatStore.getState().selectedUser;

  const deleteMessagesHistory = useChatStore.getState().deleteMessagesHistory;

  // ...........handleClosePopup............//
  const handleClosePopup = (e) => {
    e.stopPropagation();
    setRightPopUp(null);
    setStoreMessageId(null);
    setIsMessageHoverPopup(false);
    console.log("Closed the all popups");
  };

  // ...........handleDeleteMessagesHis..........//

  const handleDeleteMessagesHis = async (e) => {
    e.stopPropagation();
    await deleteMessagesHistory(selectedUser);
    setRightPopUp(null);

    console.log("called kill");
  };

  // ...............handleMouseRight .............//

  const handleMouseRight = (e, user) => {
    e.preventDefault();
    if (user?._id !== selectedUser) {
      setisShowCloseChat(false);
    } else {
      setisShowCloseChat(true);
    }
    setStoreMessageId(null);

    console.log(user?._id);
    const rect = e.target.getBoundingClientRect();
    console.log(rect);
    const isUpperHalf = rect.top < window.innerHeight / 2;
    setPopupPosition(isUpperHalf ? "bottom" : "top");

    setRightPopUp({
      user,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // ..............return functions................//
  return { handleClosePopup, handleDeleteMessagesHis, handleMouseRight };
}
