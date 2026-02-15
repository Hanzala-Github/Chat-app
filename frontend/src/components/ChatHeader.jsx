// import React from "react";
// import { X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// import { useStates } from "../store/useStates";
// import { useGetUsers } from "../hooks/useChatQueries";
// import { useJoinChatRoom } from "../hooks/useJoinChatRoom";
// import { getChatId } from "../lib/utils";

// export const ChatHeader = React.memo(() => {
//   useJoinChatRoom();
//   const setSelectedUser = useStates.getState().setSelectedUser;
//   const selectedUser = useStates((state) => state.selectedUser); // likely userId or chatId
//   const { data: users = [] } = useGetUsers();
//   const onlineUsers = useAuthStore((state) => state.onlineUsers);
//   const authUser = useAuthStore((state) => state.authUser);
//   const typingUsers = useStates((state) => state.typingUsers);

//   const currentUser = users.find((u) => u._id === selectedUser);

//   const chatId = getChatId(authUser?._id, selectedUser);
//   const typingUserId = typingUsers[chatId];
//   // console.log("typingUserId", typingUserId);
//   const isOtherUserTyping = typingUserId && typingUserId !== authUser?._id;
//   // console.log(
//   //   "isOtherUserTypingisOtherUserTypingisOtherUserTyping",
//   //   isOtherUserTyping
//   // );
//   console.log("ChatHeader component");
//   return (
//     <div className="p-2.5 border-b border-base-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="avatar">
//             <div className="size-10 rounded-full relative">
//               <img
//                 src={currentUser?.profilePic || "/avatar.png"}
//                 alt={currentUser?.fullName || "User Avatar"}
//               />
//             </div>
//           </div>

//           <div>
//             <h3 className="font-medium">{currentUser?.fullName}</h3>
//             <p className="text-sm text-base-content/70">
//               {onlineUsers.includes(selectedUser) ? (
//                 isOtherUserTyping ? (
//                   <span className="text-green-400">typing...</span>
//                 ) : (
//                   "Online"
//                 )
//               ) : (
//                 "Offline"
//               )}
//             </p>
//           </div>
//         </div>

//         <button onClick={() => setSelectedUser(null)}>
//           <X />
//         </button>
//       </div>
//     </div>
//   );
// });

import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useStates } from "../store/useStates";
import { useGetUsers } from "../hooks/useChatQueries";
import { useJoinChatRoom } from "../hooks/useJoinChatRoom";
import { TypingIndicator } from "./TypingIndicator";

export const ChatHeader = React.memo(() => {
  useJoinChatRoom();

  const setSelectedUser = useStates.getState().setSelectedUser;
  const selectedUser = useStates((state) => state.selectedUser);

  const { data: users = [] } = useGetUsers();
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  const currentUser = users.find((u) => u._id === selectedUser);

  console.log("ChatHeader render"); // 🧪 Test: should NOT log when typing

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={currentUser?.profilePic || "/avatar.png"}
                alt={currentUser?.fullName || "User Avatar"}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{currentUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser) ? (
                <TypingIndicator />
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
});
