import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Search, Users } from "lucide-react";
import { ChatOptionsPopup, SidebarSkeleton } from "./component";
import { useStates } from "../store/useStates";
import { useFunctions } from "../hooks/useFunctions";
// sidebar component
export const Sidebar = () => {
  // const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
  //   useChatStore();
  // const { onlineUsers } = useAuthStore();
  // const { setisShowCloseChat, rightPopUp, setRightPopUp } = useStates();

  const getUsers = useChatStore.getState().getUsers;
  const setSelectedUser = useChatStore.getState().setSelectedUser;
  const users = useChatStore((state) => state.users);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);

  const onlineUsers = useAuthStore((state) => state.onlineUsers);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [activeColor, setactiveColor] = useState(false);
  const [searchContacts, setsearchContacts] = useState("");

  const setisShowCloseChat = useStates.getState().setisShowCloseChat;

  const setRightPopUp = useStates.getState().setRightPopUp;

  const rightPopUp = useStates((state) => state.rightPopUp);
  const setSingleMessageReply = useStates.getState().setSingleMessageReply;
  const setIsReplyChatOpen = useStates.getState().setIsReplyChatOpen;

  const { handleClosePopup, handleMouseRight } = useFunctions();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user?._id))
    : users.filter((user) =>
        user.fullName?.toLowerCase().includes(searchContacts.toLowerCase())
      );

  const handleSelectUser = (e, userId = null) => {
    e.stopPropagation();
    if (selectedUser === userId) {
      setSelectedUser(null);
      setRightPopUp(null);
    } else {
      setSelectedUser(userId);
      setSingleMessageReply(null);
      setIsReplyChatOpen(false);
      setRightPopUp(null);
      if (userId === userId) {
        setisShowCloseChat(true);
      }
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  //   ..............This is the jsx return part..................//
  return (
    <aside
      onClick={handleClosePopup}
      className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200"
    >
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <label
          onClick={() => setactiveColor(true)}
          onBlur={() => setactiveColor(false)}
          className={`cursor-pointer flex items-center gap-2 mt-3 border rounded-[3px] border-[#2f3a47] p-2 px-3  ${
            activeColor
              ? "bg-[#0d0e10] border-b-[#5251D4]"
              : "border-b-[#7ba2d2]"
          }`}
        >
          <span>
            <Search size={15} className="rotate-[90deg]" />
          </span>
          <input
            onChange={(e) => setsearchContacts(e.target.value)}
            type="text"
            placeholder="Search contacts"
            className="w-full focus:outline-none"
          />
        </label>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div onClick={handleClosePopup} className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <div
            key={user?._id}
            onClick={
              user?._id !== selectedUser
                ? (e) => handleSelectUser(e, user?._id)
                : undefined
            }
            onContextMenu={(e) => handleMouseRight(e, user)}
            className={`
            w-full p-3 flex items-center relative gap-3
            hover:bg-base-300 transition-colors
            active:bg-base-300 transition-colors
            ${
              selectedUser === user._id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }
          `}
          >
            {/* Right-click Popup */}
            {rightPopUp?.user._id === user._id && (
              <ChatOptionsPopup handleSelectUser={handleSelectUser} />
            )}

            {/* Profile Picture & Online Status */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User Info */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user?.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user?._id) ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
