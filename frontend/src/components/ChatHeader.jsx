import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
export const ChatHeader = () => {
  // const { selectedUser, setSelectedUser, users } = useChatStore();
  // const { onlineUsers } = useAuthStore();

  const setSelectedUser = useChatStore.getState().setSelectedUser;
  const selectedUser = useChatStore((state) => state.selectedUser);
  const users = useChatStore((state) => state.users);

  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  // ..........This is the jsx return part..............//
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  users.find((user) => user?._id === selectedUser)
                    ?.profilePic || "/avatar.png"
                }
                alt={
                  users.find((user) => user?._id === selectedUser)?.fullName ||
                  "User Avatar"
                }
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
