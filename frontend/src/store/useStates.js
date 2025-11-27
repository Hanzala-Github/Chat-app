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
  // .............showPicker...................//
  isSending: false,
  setIsSending: (isSending) => set({ isSending }),

  // .................showDeletePopup......................//
  showDeletePopup: false,
  setShowDeletePopup: (showDeletePopup) => set({ showDeletePopup }),
  // .............selectedUser...............//
  selectedUser: null,
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // .............text.............//
  text: "",
  setText: (text) => set({ text: String(text ?? "") }),

  // ..........typingUsers......................//
  typingUsers: {}, // { chatId: userId }
  setTyping: (chatId, userId, isTyping) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [chatId]: isTyping ? userId : null,
      },
    })),
  // ............drafts.............//

  // drafts: {},
  // setdrafts: (authId, chatId, textVal = "") => {
  //   set((state) => {
  //     // clone the existing drafts for this user
  //     const userDrafts = { ...(state.drafts[authId] || {}) };

  //     if (textVal.trim()) {
  //       // save/update draft if not empty
  //       userDrafts[chatId] = textVal;
  //     } else {
  //       // remove draft if empty
  //       delete userDrafts[chatId];
  //     }

  //     return {
  //       drafts: {
  //         ...state.drafts,
  //         [authId]: userDrafts,
  //       },
  //     };
  //   });
  // },

  // draft : Store data in tyhis form => draft = {
  //   "111": {
  //     "111_222": "hello",
  //     "111_333": "ok bro"
  //   },
  //   "999": {
  //     "999_555": "typing..."
  //   }
  // }

  drafts: {},

  // setDraftText
  // chatId is look like this : "111_222"
  setDraft: (authId, chatId, text = "") => {
    console.log(chatId);
    set((state) => {
      // userDreaf svae data from this form : "111": {
      //     "111_222": "hello",
      //     "111_333": "ok bro"
      //   },
      const userDrafts = { ...(state.drafts[authId] || {}) };

      if (text.trim()) {
        userDrafts[chatId] = text;
      } else {
        delete userDrafts[chatId];
      }

      return {
        drafts: {
          ...state.drafts,
          [authId]: userDrafts,
        },
      };
    });
  },

  clearDraft: (authId, chatId) => {
    set((state) => {
      const userDrafts = { ...(state.drafts[authId] || {}) };
      delete userDrafts[chatId];

      return {
        drafts: {
          ...state.drafts,
          [authId]: userDrafts,
        },
      };
    });
  },

  // --------updateMessageStatus__markChatAsSeen-----------//

  messages: {}, // { [chatId]: [messageObjects] }

  addMessageToChat: (chatId, newMessage) =>
    set((state) => {
      const msgs = state.messages[chatId] || [];
      const exists = msgs.some((m) => m._id === newMessage._id);

      if (exists) return state;
      return {
        messages: { ...state.messages, [chatId]: [...msgs, newMessage] },
      };
    }),

  updateMessageStatus: (chatId, messageId, status) =>
    set((state) => {
      const msgs = state.messages[chatId] || [];
      const updated = msgs.map((msg) =>
        msg._id === messageId ? { ...msg, status } : msg
      );
      return { messages: { ...state.messages, [chatId]: updated } };
    }),

  // --------------markChatAsSeen---------------//
  markChatAsSeen: (chatId) =>
    set((state) => {
      const msgs = state.messages[chatId] || [];
      const updated = msgs.map((m) => ({ ...m, status: "seen" }));
      return { messages: { ...state.messages, [chatId]: updated } };
    }),
}));
