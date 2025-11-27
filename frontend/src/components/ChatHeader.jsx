// // ...................................................................//
// import React from "react";
// import { X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// // import { useChatStore } from "../store/useChatStore";
// import { useStates } from "../store/useStates";
// import { useGetUsers } from "../hooks/useChatQueries";
// export const ChatHeader = () => {
//   // const setSelectedUser = useChatStore.getState().setSelectedUser;
//   // const selectedUser = useChatStore((state) => state.selectedUser);
//   const setSelectedUser = useStates.getState().setSelectedUser;
//   const selectedUser = useStates((state) => state.selectedUser);
//   // const users = useChatStore((state) => state.users);
//   const { data: users = [] } = useGetUsers();
//   // const authUser = useAuthStore((state) => state.authUser);

//   const onlineUsers = useAuthStore((state) => state.onlineUsers);

//   //------ typing indicaator---------//

//   const typingUsers = useStates((state) => state.typingUsers);
//   const typingUser = typingUsers[selectedUser];
//   console.log(typingUsers);
//   console.log(typingUser);

//   // ..........This is the jsx return part..............//
//   return (
//     <div className="p-2.5 border-b border-base-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Avatar */}
//           <div className="avatar">
//             <div className="size-10 rounded-full relative">
//               <img
//                 src={
//                   users.find((user) => user?._id === selectedUser)
//                     ?.profilePic || "/avatar.png"
//                 }
//                 alt={
//                   users.find((user) => user?._id === selectedUser)?.fullName ||
//                   "User Avatar"
//                 }
//               />
//             </div>
//           </div>

//           {/* User info */}
//           <div>
//             <h3 className="font-medium">{selectedUser?.fullName}</h3> {/*fix this*/}
//             <p className="text-sm text-base-content/70">
//               {/* {onlineUsers.includes(selectedUser) ? "Online" : "Offline"} */}
//               {onlineUsers.includes(selectedUser)
//                 ? typingUser
//                   ? "typing..."
//                   : "Online"
//                 : "Offline"}
//             </p>
//           </div>
//         </div>

//         {/* Close button */}
//         <button onClick={() => setSelectedUser(null)}>
//           <X />
//         </button>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useStates } from "../store/useStates";
import { useGetUsers } from "../hooks/useChatQueries";
import { useJoinChatRoom } from "../hooks/useJoinChatRoom ";
import { getChatId } from "../lib/utils";

export const ChatHeader = () => {
  useJoinChatRoom();
  const setSelectedUser = useStates.getState().setSelectedUser;
  const selectedUser = useStates((state) => state.selectedUser); // likely userId or chatId
  const { data: users = [] } = useGetUsers();
  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const authUser = useAuthStore((state) => state.authUser);
  const typingUsers = useStates((state) => state.typingUsers);

  const currentUser = users.find((u) => u._id === selectedUser);

  const chatId = getChatId(authUser?._id, selectedUser);
  const typingUserId = typingUsers[chatId];
  console.log("typingUserId", typingUserId);
  const isOtherUserTyping = typingUserId && typingUserId !== authUser?._id;
  console.log(
    "isOtherUserTypingisOtherUserTypingisOtherUserTyping",
    isOtherUserTyping
  );
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
                isOtherUserTyping ? (
                  <span className="text-green-400">typing...</span>
                ) : (
                  "Online"
                )
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
};
