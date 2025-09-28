// import { create } from "zustand";

// export const useStates = create((set) => ({
//   // .............selectedUser...............//
//   selectedUser: null,
//   setSelectedUser: (selectedUser) => set({ selectedUser }),

//   // ...........discardImage...................//
//   discardImage: false,
//   setDiscardImage: (value) => set({ discardImage: value }),

//   // .....popupPosition top bottom................//
//   popupPosition: "bottom",
//   setPopupPosition: (value) => set({ popupPosition: value }),
//   // .........popupPosition left right................//
//   popupPositionLeftRight: "left",
//   setPopupPositionLeftRight: (value) => set({ popupPositionLeftRight: value }),
//   // ...............isShowCloseChat...............//
//   isShowCloseChat: false,
//   setisShowCloseChat: (value) => set({ isShowCloseChat: value }),

//   // ...............isMessageHoverPopup..................//
//   isMessageHoverPopup: false,
//   setIsMessageHoverPopup: (value) => set({ isMessageHoverPopup: value }),

//   // ...............isReplyChatOpen..................//
//   isReplyChatOpen: false,
//   setIsReplyChatOpen: (value) => set({ isReplyChatOpen: value }),
//   // ...............rightPopUp..................//
//   rightPopUp: null,
//   setRightPopUp: (value) => set({ rightPopUp: value }),

//   // .............storeMessageId....................//
//   storeMessageId: null,
//   setStoreMessageId: (id) => set({ storeMessageId: id }),
//   // .............storeMsgIdToSetDeleteMsgPopup....................//
//   storeMsgIdToSetDeleteMsgPopup: null,
//   setStoreMsgIdToSetDeleteMsgPopup: (id) =>
//     set({ storeMsgIdToSetDeleteMsgPopup: id }),
//   // .............singleMessageReply....................//
//   singleMessageReply: null,
//   setSingleMessageReply: (singleMessageReply) => set({ singleMessageReply }),
//   // .............storeMessageId....................//
//   storeMessageIdOnReplyMessage: null,
//   setStoreMessageIdOnReplyMessage: (id) =>
//     set({ storeMessageIdOnReplyMessage: id }),

//   // .............showPicker...................//
//   showPicker: false,
//   setShowPicker: () => set((state) => ({ showPicker: !state.showPicker })),

//   // .................showDeletePopup......................//
//   showDeletePopup: false,
//   setShowDeletePopup: (showDeletePopup) => set({ showDeletePopup }),
// }));

// .................................................................//

import { create } from "zustand";

export const useStates = create((set) => ({
  // .............openMessagePopup...............//

  // openMessagePopup: null,
  // setOpenMessagePopup: (openMessagePopup) => set({ openMessagePopup }),

  // ...........discardImage...................//
  discardImage: false,
  setDiscardImage: (value) => set({ discardImage: value }),

  // .....popupPosition top bottom................//
  popupPosition: "bottom",
  setPopupPosition: (value) => set({ popupPosition: value }),
  // .........popupPosition left right................//
  popupPositionLeftRight: "left",
  setPopupPositionLeftRight: (value) => set({ popupPositionLeftRight: value }),
  // ...............isShowCloseChat...............//
  isShowCloseChat: false,
  setisShowCloseChat: (value) => set({ isShowCloseChat: value }),

  // ...............isMessageHoverPopup..................//
  isMessageHoverPopup: false,
  setIsMessageHoverPopup: (value) => set({ isMessageHoverPopup: value }),

  // ...............isReplyChatOpen..................//
  isReplyChatOpen: false,
  setIsReplyChatOpen: (value) => set({ isReplyChatOpen: value }),
  // ...............rightPopUp..................//
  rightPopUp: null,
  setRightPopUp: (value) => set({ rightPopUp: value }),

  // .............storeMessageId....................//
  storeMessageId: null,
  setStoreMessageId: (id) => set({ storeMessageId: id }),
  // .............storeMsgIdToSetDeleteMsgPopup....................//
  storeMsgIdToSetDeleteMsgPopup: null,
  setStoreMsgIdToSetDeleteMsgPopup: (id) =>
    set({ storeMsgIdToSetDeleteMsgPopup: id }),
  // .............singleMessageReply....................//
  singleMessageReply: null,
  setSingleMessageReply: (singleMessageReply) => set({ singleMessageReply }),
  // .............storeMessageId....................//
  storeMessageIdOnReplyMessage: null,
  setStoreMessageIdOnReplyMessage: (id) =>
    set({ storeMessageIdOnReplyMessage: id }),

  // .............showPicker...................//
  showPicker: false,
  setShowPicker: () => set((state) => ({ showPicker: !state.showPicker })),

  // .................showDeletePopup......................//
  showDeletePopup: false,
  setShowDeletePopup: (showDeletePopup) => set({ showDeletePopup }),
  // .............selectedUser...............//
  selectedUser: null,
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
